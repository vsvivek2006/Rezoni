import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getRazorpayKeys } from '@/lib/razorpayServer';
import {
  getOrderByRazorpayOrderIdAsync,
  markOrderPaidAsync,
  markOrderFailedAsync,
} from '@/lib/orderStore';
import { getSupabaseAdminClient } from '@/lib/supabaseServer';

/**
 * Audit log helper: Records every incoming webhook event into Supabase
 */
async function recordWebhookAuditLog(entry: {
  eventId: string | null;
  eventType: string;
  entityId: string | null;
  status: 'processed' | 'ignored' | 'failed' | 'signature_mismatch';
  payload: any;
  errorMessage?: string;
}): Promise<void> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  try {
    await supabase.from('webhook_logs').insert({
      event_id: entry.eventId,
      event_type: entry.eventType,
      entity_id: entry.entityId,
      status: entry.status,
      payload: entry.payload,
      error_message: entry.errorMessage || null,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Webhook Audit Log] Failed to write log to Supabase:', err);
  }
}

/**
 * Production Razorpay Webhook Handler
 * Endpoint: POST /api/razorpay/webhook
 */
export async function POST(req: NextRequest) {
  let eventType = 'unknown';
  let eventId: string | null = null;
  let parsedPayload: any = {};

  try {
    // 1. Read raw body as text for HMAC-SHA256 signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    eventId = req.headers.get('x-razorpay-event-id');

    const { webhookSecret } = getRazorpayKeys();

    // 2. Cryptographic HMAC-SHA256 signature verification
    if (webhookSecret) {
      if (!signature) {
        console.warn('[Webhook] Missing x-razorpay-signature header');
        await recordWebhookAuditLog({
          eventId,
          eventType: 'unknown',
          entityId: null,
          status: 'signature_mismatch',
          payload: { error: 'Missing x-razorpay-signature' },
          errorMessage: 'Header x-razorpay-signature was missing',
        });
        return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 });
      }

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      const isSignatureValid =
        expectedSignature.length === signature.length &&
        crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));

      if (!isSignatureValid) {
        console.warn('[Webhook] Cryptographic signature mismatch. Rejecting webhook request.');
        await recordWebhookAuditLog({
          eventId,
          eventType: 'unknown',
          entityId: null,
          status: 'signature_mismatch',
          payload: { receivedSignature: signature },
          errorMessage: 'HMAC-SHA256 signature verification failed',
        });
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    } else {
      console.warn(
        '[Webhook] RAZORPAY_WEBHOOK_SECRET is not configured. Skipping cryptographic signature check.'
      );
    }

    // 3. Parse JSON event payload
    parsedPayload = JSON.parse(rawBody);
    eventType = parsedPayload?.event || 'unknown';
    eventId = eventId || parsedPayload?.id || null;

    // 4. Idempotency Check: Avoid processing duplicate events
    if (eventId) {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { data: existingLog } = await supabase
          .from('webhook_logs')
          .select('id, status')
          .eq('event_id', eventId)
          .eq('status', 'processed')
          .limit(1);

        if (existingLog && existingLog.length > 0) {
          console.log(`[Webhook] Duplicate event ${eventId} (${eventType}) detected. Acknowledging with 200 OK.`);
          return NextResponse.json({ status: 'ok', message: 'Duplicate event already processed' }, { status: 200 });
        }
      }
    }

    let entityId: string | null = null;
    let processingStatus: 'processed' | 'ignored' | 'failed' = 'ignored';
    let processingNotes = '';

    // 5. Handle Supported Events
    switch (eventType) {
      case 'order.paid': {
        const orderEntity = parsedPayload?.payload?.order?.entity;
        const paymentEntity = parsedPayload?.payload?.payment?.entity;
        const rzpOrderId = orderEntity?.id || paymentEntity?.order_id;
        const rzpPaymentId = paymentEntity?.id;
        entityId = rzpOrderId;

        if (rzpOrderId) {
          const order = await getOrderByRazorpayOrderIdAsync(rzpOrderId);
          if (order) {
            if (order.status !== 'paid') {
              await markOrderPaidAsync(order.orderId, { razorpayPaymentId: rzpPaymentId });
              processingStatus = 'processed';
              processingNotes = `Order ${order.orderId} marked as paid via order.paid`;
              console.log(`[Webhook] ${processingNotes}`);
            } else {
              processingStatus = 'processed';
              processingNotes = `Order ${order.orderId} was already paid. Idempotency confirmed.`;
            }
          } else {
            processingStatus = 'failed';
            processingNotes = `No local/Supabase order found matching Razorpay Order ${rzpOrderId}`;
            console.warn(`[Webhook] ${processingNotes}`);
          }
        }
        break;
      }

      case 'payment.captured': {
        const paymentEntity = parsedPayload?.payload?.payment?.entity;
        const rzpOrderId = paymentEntity?.order_id;
        const rzpPaymentId = paymentEntity?.id;
        entityId = rzpPaymentId || rzpOrderId;

        if (rzpOrderId) {
          const order = await getOrderByRazorpayOrderIdAsync(rzpOrderId);
          if (order) {
            if (order.status !== 'paid') {
              await markOrderPaidAsync(order.orderId, { razorpayPaymentId: rzpPaymentId });
              processingStatus = 'processed';
              processingNotes = `Order ${order.orderId} captured with payment ID ${rzpPaymentId}`;
              console.log(`[Webhook] ${processingNotes}`);
            } else {
              processingStatus = 'processed';
              processingNotes = `Order ${order.orderId} already paid. Capture noted.`;
            }
          }
        }
        break;
      }

      case 'payment.failed': {
        const paymentEntity = parsedPayload?.payload?.payment?.entity;
        const rzpOrderId = paymentEntity?.order_id;
        const rzpPaymentId = paymentEntity?.id;
        const errorCode = paymentEntity?.error_code;
        const errorDesc = paymentEntity?.error_description;
        entityId = rzpPaymentId || rzpOrderId;

        if (rzpOrderId) {
          const order = await getOrderByRazorpayOrderIdAsync(rzpOrderId);
          if (order && order.status !== 'paid') {
            await markOrderFailedAsync(order.orderId);
            processingStatus = 'processed';
            processingNotes = `Order ${order.orderId} marked as failed (${errorCode}: ${errorDesc})`;
            console.log(`[Webhook] ${processingNotes}`);
          }
        }
        break;
      }

      default: {
        processingStatus = 'ignored';
        processingNotes = `Event ${eventType} received but not actively handled.`;
        console.log(`[Webhook] ${processingNotes}`);
        break;
      }
    }

    // 6. Record audit log in Supabase for full observability
    await recordWebhookAuditLog({
      eventId,
      eventType,
      entityId,
      status: processingStatus,
      payload: parsedPayload,
      errorMessage: processingStatus === 'failed' ? processingNotes : undefined,
    });

    // 7. Always return HTTP 200 to Razorpay within timeout threshold
    return NextResponse.json({
      status: 'ok',
      received: true,
      event: eventType,
      processingStatus,
      notes: processingNotes,
    });
  } catch (error: any) {
    console.error('[Webhook] Unhandled exception processing Razorpay webhook:', error);

    await recordWebhookAuditLog({
      eventId,
      eventType,
      entityId: null,
      status: 'failed',
      payload: parsedPayload,
      errorMessage: error?.message || 'Unhandled webhook processing error',
    });

    // Return 500 so Razorpay retries if it was an internal server crash
    return NextResponse.json(
      { error: error?.message || 'Internal webhook error' },
      { status: 500 }
    );
  }
}
