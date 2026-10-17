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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const query = searchParams.get('q')?.toLowerCase();

    const supabase = getSupabaseAdminClient();
    let orders: any[] = [];

    if (supabase) {
      let q = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (status && status !== 'all') {
        q = q.eq('order_status', status);
      }
      const { data, error } = await q;
      if (!error && data) {
        orders = data.map((o) => ({
          id: o.order_id || o.id,
          customerName: o.customer_name || o.customer?.fullName || 'Rezoni Customer',
          customerEmail: o.customer_email || o.customer?.email || 'customer@rezoni.com',
          customerPhone: o.customer_phone || o.customer?.phone || '',
          shippingAddress: o.shipping_address || o.customer,
          items: o.items || [],
          total: Number(o.total_amount || o.amount || o.total) || 0,
          status: o.order_status || o.status || 'confirmed',
          carrier: o.carrier || 'BlueDart Express',
          trackingNumber: o.tracking_number || '',
          date: o.created_at ? new Date(o.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent',
        }));
      }
    }

    // Fallback to local db if Supabase returned 0
    if (orders.length === 0) {
      try {
        const localPath = fs.existsSync(path.resolve(process.cwd(), 'src', 'data', 'db.json'))
          ? path.resolve(process.cwd(), 'src', 'data', 'db.json')
          : path.resolve(process.cwd(), '..', 'src', 'data', 'db.json');
        if (fs.existsSync(localPath)) {
          const raw = JSON.parse(fs.readFileSync(localPath, 'utf8'));
          orders = raw.orders || [];
          if (status && status !== 'all') {
            orders = orders.filter((o) => o.status === status);
          }
        }
      } catch (e) {}
    }

    if (query) {
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(query) ||
          (o.customerName && o.customerName.toLowerCase().includes(query)) ||
          (o.customerEmail && o.customerEmail.toLowerCase().includes(query)) ||
          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, status, trackingNumber, carrier } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Order ID is required.' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const updatePayload: any = {};
    if (status) updatePayload.order_status = status;
    if (trackingNumber) updatePayload.tracking_number = trackingNumber;
    if (carrier) updatePayload.carrier = carrier;

    if (supabase) {
      await supabase.from('orders').update(updatePayload).eq('order_id', orderId);
    }

    // Also update local db if present
    try {
      const localPath = fs.existsSync(path.resolve(process.cwd(), 'src', 'data', 'db.json'))
        ? path.resolve(process.cwd(), 'src', 'data', 'db.json')
        : path.resolve(process.cwd(), '..', 'src', 'data', 'db.json');
      if (fs.existsSync(localPath)) {
        const raw = JSON.parse(fs.readFileSync(localPath, 'utf8'));
        const order = (raw.orders || []).find((o: any) => o.id === orderId);
        if (order) {
          if (status) order.status = status;
          if (trackingNumber) order.trackingNumber = trackingNumber;
          if (carrier) order.carrier = carrier;
          fs.writeFileSync(localPath, JSON.stringify(raw, null, 2), 'utf8');
        }
      }
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `Order ${orderId} updated successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}
