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
        if (status === 'confirmed') {
          q = q.in('status', ['confirmed', 'paid', 'created']);
        } else {
          q = q.eq('status', status);
        }
      }
      const { data, error } = await q;
      if (!error && data) {
        orders = data.map((o) => {
          let orderStatus = (o.status || 'confirmed').toLowerCase();
          if (orderStatus === 'paid' || orderStatus === 'created') {
            orderStatus = 'confirmed';
          }
          return {
            id: o.order_id || o.id,
            customerName: o.customer?.fullName || o.customer?.name || o.customer_name || 'Rezoni Customer',
            customerEmail: o.customer?.email || o.customer_email || 'customer@rezoni.com',
            customerPhone: o.customer?.phone || o.customer_phone || '',
            shippingAddress: o.shipping_address || o.customer,
            items: o.items || [],
            total: Number(o.amount || o.total_amount || o.total) || 0,
            status: orderStatus,
            carrier: o.customer?.carrier || o.carrier || 'BlueDart Express',
            trackingNumber: o.customer?.trackingNumber || o.tracking_number || o.razorpay_order_id || '',
            date: o.created_at ? new Date(o.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent',
          };
        });
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
    let supabaseSuccess = false;
    let supabaseError: string | null = null;

    if (supabase) {
      // 1. Fetch existing order to safely merge customer metadata
      const { data: existingList } = await supabase
        .from('orders')
        .select('*')
        .or(`order_id.eq."${orderId}",id.eq."${orderId}"`)
        .limit(1);

      const existingOrder = existingList && existingList[0] ? existingList[0] : null;

      const updatePayload: any = {};
      if (status) {
        updatePayload.status = status;
      }

      const mergedCustomer = {
        ...(existingOrder?.customer || {}),
        ...(carrier ? { carrier } : {}),
        ...(trackingNumber ? { trackingNumber } : {}),
      };

      updatePayload.customer = mergedCustomer;
      if (trackingNumber) {
        updatePayload.razorpay_order_id = trackingNumber;
      }

      // 2. Perform Supabase update with error checking
      const { data: updatedData, error } = await supabase
        .from('orders')
        .update(updatePayload)
        .or(`order_id.eq."${orderId}",id.eq."${orderId}"`)
        .select();

      if (error) {
        console.error('Supabase order status update error:', error);
        supabaseError = error.message;
      } else if (updatedData && updatedData.length > 0) {
        supabaseSuccess = true;
      }
    }

    // Also update local db and orders.json if present
    try {
      // 1. orders.json
      const ordersJsonPath = path.resolve(process.cwd(), '..', 'src', 'data', 'orders.json');
      if (fs.existsSync(ordersJsonPath)) {
        const ords = JSON.parse(fs.readFileSync(ordersJsonPath, 'utf8'));
        const found = ords.find((o: any) => o.orderId === orderId || o.id === orderId);
        if (found) {
          if (status) found.status = status;
          if (carrier) found.carrier = carrier;
          if (trackingNumber) found.trackingNumber = trackingNumber;
          fs.writeFileSync(ordersJsonPath, JSON.stringify(ords, null, 2), 'utf8');
        }
      }

      // 2. db.json
      const localPaths = [
        path.resolve(process.cwd(), 'src', 'data', 'db.json'),
        path.resolve(process.cwd(), '..', 'src', 'data', 'db.json'),
      ];
      for (const p of localPaths) {
        if (fs.existsSync(p)) {
          const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
          const order = (raw.orders || []).find((o: any) => o.id === orderId || o.orderId === orderId);
          if (order) {
            if (status) order.status = status;
            if (trackingNumber) order.trackingNumber = trackingNumber;
            if (carrier) order.carrier = carrier;
            fs.writeFileSync(p, JSON.stringify(raw, null, 2), 'utf8');
          }
        }
      }
    } catch (e) {
      console.warn('Local file sync note:', e);
    }

    if (supabaseError && !supabaseSuccess) {
      return NextResponse.json({
        success: false,
        message: `Supabase update failed: ${supabaseError}`,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Order ${orderId} status successfully updated to ${status}.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}
