import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getRazorpayKeys, getRazorpayInstance } from '@/lib/razorpayServer';
import { markOrderPaidAsync, markOrderFailedAsync, getOrderByIdAsync } from '@/lib/orderStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, failed, error } = body;

    // Handle client-reported payment failure
    if (failed) {
      if (orderId) {
        console.warn(`[Payment] Client reported payment failure for order: ${orderId}`, error);
        await markOrderFailedAsync(orderId);
      }
      return NextResponse.json({
        success: false,
        message: 'Order recorded as failed.',
        orderId,
      });
    }

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { success: false, message: 'Missing required payment verification parameters.' },
        { status: 400 }
      );
    }

    const { keySecret, isConfigured } = getRazorpayKeys();
    if (!isConfigured) {
      return NextResponse.json(
        { success: false, message: 'Razorpay keys not configured on server.' },
        { status: 500 }
      );
    }

    // 1. Cryptographically verify HMAC-SHA256 signature
    const dataToSign = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(dataToSign)
      .digest('hex');

    const isSignatureValid =
      expectedSignature.length === razorpaySignature.length &&
      crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpaySignature));

    if (!isSignatureValid) {
      console.warn('[Payment] Verification signature mismatch for order:', orderId);
      await markOrderFailedAsync(orderId);
      return NextResponse.json(
        { success: false, message: 'Invalid payment signature. Transaction could not be verified.' },
        { status: 400 }
      );
    }

    // 2. Double-check live payment status directly from Razorpay API
    try {
      const razorpay = getRazorpayInstance();
      const payment = await razorpay.payments.fetch(razorpayPaymentId);
      if (payment) {
        if (payment.status !== 'captured' && payment.status !== 'authorized') {
          console.warn(`[Payment] Razorpay payment ${razorpayPaymentId} is ${payment.status}, not captured.`);
          await markOrderFailedAsync(orderId);
          return NextResponse.json(
            { success: false, message: `Payment is ${payment.status}, not successfully captured.` },
            { status: 400 }
          );
        }
        if (payment.order_id && payment.order_id !== razorpayOrderId) {
          console.warn(`[Payment] Order ID mismatch: ${payment.order_id} !== ${razorpayOrderId}`);
          await markOrderFailedAsync(orderId);
          return NextResponse.json(
            { success: false, message: 'Payment does not match the Razorpay order.' },
            { status: 400 }
          );
        }
      }
    } catch (apiErr: any) {
      console.warn('[Payment] Live payments.fetch warning (relying on HMAC signature):', apiErr?.message);
    }

    // 3. Mark order as paid in orderStore & Supabase
    const updatedOrder = await markOrderPaidAsync(orderId, {
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: 'Order could not be located in database.' },
        { status: 404 }
      );
    }

    console.log(`[Payment] Order ${orderId} successfully verified & paid (Payment ID: ${razorpayPaymentId})`);

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order confirmed successfully.',
      orderId: updatedOrder.orderId,
      razorpayPaymentId,
    });
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Server error while verifying payment.',
      },
      { status: 500 }
    );
  }
}
