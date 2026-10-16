import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getRazorpayKeys } from '@/lib/razorpayServer';
import { markOrderPaidAsync, markOrderFailedAsync } from '@/lib/orderStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

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

    // Verify HMAC-SHA256 signature
    const dataToSign = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(dataToSign)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    const isSignatureValid =
      expectedSignature.length === razorpaySignature.length &&
      crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpaySignature));

    if (!isSignatureValid) {
      console.warn('Payment verification signature mismatch for order:', orderId);
      await markOrderFailedAsync(orderId);
      return NextResponse.json(
        { success: false, message: 'Invalid payment signature. Transaction could not be verified.' },
        { status: 400 }
      );
    }

    // Update order status in orderStore & Supabase
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
