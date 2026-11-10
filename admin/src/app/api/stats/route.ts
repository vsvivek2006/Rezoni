import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabaseServer';
import { getAdminSessionFromRequest } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

function readContactsCount(): { total: number; unread: number } {
  const paths = [
    path.resolve(process.cwd(), 'src', 'data', 'contacts.json'),
    path.resolve(process.cwd(), '..', 'src', 'data', 'contacts.json'),
    path.resolve(process.cwd(), 'data', 'contacts.json'),
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      try {
        const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
        if (Array.isArray(raw)) {
          return {
            total: raw.length,
            unread: raw.filter((c: any) => c.status === 'unread').length,
          };
        }
      } catch {}
    }
  }
  return { total: 0, unread: 0 };
}

export async function GET(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const supabase = getSupabaseAdminClient();
    let orders: any[] = [];
    let returns: any[] = [];
    let registeredUsersCount = 0;
    let reviewsCount = 0;

    if (supabase) {
      // 1. Live Orders
      const { data: dbOrders } = await supabase.from('orders').select('*');
      if (dbOrders) orders = dbOrders;

      // 2. Returns
      const { data: dbReturns } = await supabase.from('returns').select('*');
      if (dbReturns) returns = dbReturns;

      // 3. Registered Users from users table
      const { count: uCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      if (uCount !== null && uCount !== undefined) registeredUsersCount = uCount;

      // 4. Reviews
      const { count: rCount } = await supabase.from('reviews').select('*', { count: 'exact', head: true });
      if (rCount !== null && rCount !== undefined) reviewsCount = rCount;
    }

    // Secondary fallback to orders.json only if supabase returned 0 orders
    if (orders.length === 0) {
      try {
        const ordersJsonPath = path.resolve(process.cwd(), '..', 'src', 'data', 'orders.json');
        if (fs.existsSync(ordersJsonPath)) {
          orders = JSON.parse(fs.readFileSync(ordersJsonPath, 'utf8'));
        }
      } catch (e) {}
    }

    function isOrderActuallyPaid(o: any): boolean {
      const paymentId = o.razorpay_payment_id || o.payment_id || o.razorpayPaymentId;
      const hasValidPaymentId = typeof paymentId === 'string' && paymentId.startsWith('pay_');
      const hasPaidAt = Boolean(o.paid_at || o.paidAt);
      const isStatusExplicitPaid = (o.order_status || o.status || '').toLowerCase() === 'paid';
      return hasValidPaymentId || hasPaidAt || isStatusExplicitPaid;
    }

    // Separate verified paid orders from unpaid checkout drop-offs and failed payments
    const paidOrders = orders.filter((o) => isOrderActuallyPaid(o));
    const failedOrders = orders.filter((o) => !isOrderActuallyPaid(o));
    const pendingOrders = orders.filter((o) => !isOrderActuallyPaid(o) && (o.order_status || o.status || '').toLowerCase() === 'pending');

    const totalOrders = paidOrders.length;
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.total_amount || o.total || o.amount) || 0), 0);
    const totalReturns = returns.length;
    const totalRefunded = returns
      .filter((r) => r.status === 'refunded')
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    const pendingDispatches = paidOrders.filter(
      (o) => (o.order_status || o.status) === 'confirmed' || (o.order_status || o.status) === 'paid'
    ).length;
    const dispatchedCount = paidOrders.filter((o) => (o.order_status || o.status) === 'dispatched').length;
    const inTransitCount = paidOrders.filter((o) => (o.order_status || o.status) === 'in_transit').length;
    const outForDeliveryCount = paidOrders.filter((o) => (o.order_status || o.status) === 'out_for_delivery').length;
    const deliveredCount = paidOrders.filter((o) => (o.order_status || o.status) === 'delivered').length;

    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const distinctEmails = new Set(
      paidOrders
        .map((o) => (o.customer_email || o.customerEmail || o.customer?.email || '').toLowerCase())
        .filter(Boolean)
    );

    // Inquiries stats from Supabase
    let totalInquiries = 0;
    let unreadInquiries = 0;
    if (supabase) {
      try {
        const { data: logInq } = await supabase
          .from('webhook_logs')
          .select('status')
          .eq('event_type', 'contact_inquiry');
        if (logInq && logInq.length > 0) {
          totalInquiries = logInq.length;
          unreadInquiries = logInq.filter((i: any) => i.status === 'unread').length;
        }
      } catch {}
    }
    if (totalInquiries === 0) {
      const fallbackInq = readContactsCount();
      totalInquiries = fallbackInq.total;
      unreadInquiries = fallbackInq.unread;
    }

    // Fetch Razorpay live balance/captured summary
    let razorpayCaptured = 0;
    let razorpaySuccessCount = 0;
    try {
      const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (keyId && keySecret) {
        const auth = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const rzRes = await fetch('https://api.razorpay.com/v1/payments?count=100', {
          headers: { Authorization: auth },
          cache: 'no-store',
        });
        if (rzRes.ok) {
          const rzData = await rzRes.json();
          (rzData.items || []).forEach((p: any) => {
            if (p.status === 'captured') {
              razorpayCaptured += (Number(p.amount || 0) / 100);
              razorpaySuccessCount++;
            }
          });
        }
      }
    } catch {}

    return NextResponse.json({
      success: true,
      metrics: {
        totalOrders,
        totalRevenue,
        netRevenue: totalRevenue - totalRefunded,
        totalReturns,
        totalRefunded,
        pendingDispatches,
        dispatchedCount,
        inTransitCount,
        outForDeliveryCount,
        deliveredCount,
        pendingOrdersCount: pendingOrders.length,
        failedOrdersCount: failedOrders.length,
        averageOrderValue,
        totalCustomers: Math.max(registeredUsersCount, distinctEmails.size),
        totalRegisteredUsers: registeredUsersCount,
        totalReviews: reviewsCount,
        totalInquiries,
        unreadInquiries,
        razorpayCaptured,
        razorpaySuccessCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}
