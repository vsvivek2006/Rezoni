import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

    if (!keyId || !keySecret) {
      return NextResponse.json({
        success: false,
        message: 'Razorpay API credentials not configured',
      }, { status: 500 });
    }

    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const res = await fetch('https://api.razorpay.com/v1/payments?count=100', {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({
        success: false,
        message: err.error?.description || 'Failed to fetch from Razorpay API',
      }, { status: res.status });
    }

    const data = await res.json();
    const rawItems = data.items || [];

    let totalCaptured = 0;
    let successfulCount = 0;
    let failedCount = 0;
    let refundedCount = 0;
    let totalRefunded = 0;

    const payments = rawItems.map((p: any) => {
      const amt = Number(p.amount || 0) / 100;
      const refAmt = Number(p.amount_refunded || 0) / 100;

      if (p.status === 'captured') {
        totalCaptured += amt;
        successfulCount++;
      } else if (p.status === 'failed') {
        failedCount++;
      }

      if (refAmt > 0) {
        refundedCount++;
        totalRefunded += refAmt;
      }

      const dateStr = p.created_at
        ? new Date(p.created_at * 1000).toLocaleDateString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Recent';

      return {
        id: p.id,
        orderId: p.order_id || p.notes?.rezoni_order_id || 'Direct',
        rezoniOrderId: p.notes?.rezoni_order_id || '',
        amount: amt,
        currency: p.currency || 'INR',
        status: p.status, // 'captured' | 'failed' | 'authorized'
        method: p.method || 'upi', // 'upi' | 'card' | 'wallet' | 'netbanking'
        email: p.email || p.notes?.customer_email || 'customer@rezoni.com',
        contact: p.contact || p.notes?.customer_phone || '',
        customerName: p.notes?.customer_name || 'Rezoni Customer',
        vpa: p.vpa || p.upi?.vpa || '',
        bank: p.bank || '',
        wallet: p.wallet || '',
        errorCode: p.error_code || null,
        errorDescription: p.error_description || null,
        date: dateStr,
        createdAt: p.created_at * 1000,
      };
    });

    const successRate = payments.length > 0
      ? Math.round((successfulCount / payments.length) * 100)
      : 100;

    return NextResponse.json({
      success: true,
      keyIdMasked: `${keyId.substring(0, 8)}...${keyId.slice(-4)}`,
      gatewayStatus: 'LIVE',
      totalCount: payments.length,
      successfulCount,
      failedCount,
      refundedCount,
      totalCaptured,
      totalRefunded,
      netBalance: totalCaptured - totalRefunded,
      successRate,
      payments,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Internal server error fetching Razorpay data',
    }, { status: 500 });
  }
}
