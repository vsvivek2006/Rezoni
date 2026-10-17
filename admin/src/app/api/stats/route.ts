import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabaseServer';
import { getAdminSessionFromRequest } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const supabase = getSupabaseAdminClient();
    let orders: any[] = [];
    let returns: any[] = [];
    let customersCount = 0;
    let reviewsCount = 0;

    if (supabase) {
      const { data: dbOrders } = await supabase.from('orders').select('*');
      if (dbOrders) orders = dbOrders;

      const { data: dbReturns } = await supabase.from('returns').select('*');
      if (dbReturns) returns = dbReturns;

      const { count: cCount } = await supabase.from('customers').select('*', { count: 'exact', head: true });
      if (cCount !== null) customersCount = cCount;

      const { count: rCount } = await supabase.from('reviews').select('*', { count: 'exact', head: true });
      if (rCount !== null) reviewsCount = rCount;
    }

    // Fallback to local db if Supabase is offline
    if (orders.length === 0) {
      try {
        const localPath = fs.existsSync(path.resolve(process.cwd(), 'src', 'data', 'db.json'))
          ? path.resolve(process.cwd(), 'src', 'data', 'db.json')
          : path.resolve(process.cwd(), '..', 'src', 'data', 'db.json');
        if (fs.existsSync(localPath)) {
          const raw = JSON.parse(fs.readFileSync(localPath, 'utf8'));
          orders = raw.orders || [];
          returns = raw.returns || [];
          customersCount = (raw.users || []).length;
          reviewsCount = (raw.reviews || []).length;
        }
      } catch (e) {}
    }

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount || o.total || o.amount) || 0), 0);
    const totalReturns = returns.length;
    const totalRefunded = returns
      .filter((r) => r.status === 'refunded')
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    const pendingDispatches = orders.filter((o) => (o.order_status || o.status) === 'confirmed' || (o.order_status || o.status) === 'paid').length;
    const dispatchedCount = orders.filter((o) => (o.order_status || o.status) === 'dispatched').length;
    const inTransitCount = orders.filter((o) => (o.order_status || o.status) === 'in_transit').length;
    const outForDeliveryCount = orders.filter((o) => (o.order_status || o.status) === 'out_for_delivery').length;
    const deliveredCount = orders.filter((o) => (o.order_status || o.status) === 'delivered').length;

    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const distinctEmails = new Set(
      orders
        .map((o) => (o.customer_email || o.customerEmail || o.customer?.email || '').toLowerCase())
        .filter(Boolean)
    );

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
        averageOrderValue,
        totalCustomers: Math.max(customersCount, distinctEmails.size),
        totalReviews: reviewsCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}
