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
    const query = searchParams.get('q')?.toLowerCase() || '';
    const filter = searchParams.get('filter'); // 'all' | 'registered'

    const supabase = getSupabaseAdminClient();
    const customerMap = new Map<string, any>();

    if (supabase) {
      // 1. Fetch real registered users from Supabase users table
      const { data: users } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (users) {
        users.forEach((u) => {
          const email = (u.email || '').toLowerCase();
          customerMap.set(email, {
            id: u.id,
            name: u.name || email.split('@')[0],
            email: u.email,
            phone: '',
            isRegistered: true,
            ordersCount: 0,
            totalSpent: 0,
            registeredAt: u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' }) : 'Registered',
            lastOrder: 'No orders yet',
          });
        });
      }

      // 2. Fetch real orders to aggregate spend & buyer info
      const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (orders) {
        orders.forEach((o) => {
          const email = (o.customer?.email || o.customer_email || 'guest@rezoni.com').toLowerCase();
          const existing = customerMap.get(email);
          const orderTotal = Number(o.amount || o.total_amount || o.total) || 0;
          const orderDate = o.created_at ? new Date(o.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent';
          const custName = o.customer?.fullName || o.customer?.name || o.customer_name || email.split('@')[0];
          const custPhone = o.customer?.phone || o.customer_phone || '';

          if (existing) {
            existing.ordersCount += 1;
            existing.totalSpent += orderTotal;
            existing.lastOrder = orderDate;
            if (custName && (existing.name.includes('@') || !existing.name)) existing.name = custName;
            if (custPhone && !existing.phone) existing.phone = custPhone;
          } else {
            customerMap.set(email, {
              id: o.id || o.order_id,
              name: custName,
              email: o.customer?.email || o.customer_email || email,
              phone: custPhone,
              isRegistered: false,
              ordersCount: 1,
              totalSpent: orderTotal,
              registeredAt: 'Guest Checkout',
              lastOrder: orderDate,
            });
          }
        });
      }
    }

    // Secondary sync from orders.json if Supabase was empty
    if (customerMap.size === 0) {
      try {
        const ordersJsonPath = path.resolve(process.cwd(), '..', 'src', 'data', 'orders.json');
        if (fs.existsSync(ordersJsonPath)) {
          const ords = JSON.parse(fs.readFileSync(ordersJsonPath, 'utf8'));
          ords.forEach((o: any) => {
            const email = (o.customer?.email || 'guest@rezoni.com').toLowerCase();
            const existing = customerMap.get(email);
            const total = Number(o.amount || 0);
            const d = o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Recent';
            if (existing) {
              existing.ordersCount += 1;
              existing.totalSpent += total;
            } else {
              customerMap.set(email, {
                name: o.customer?.fullName || 'Customer',
                email: o.customer?.email || email,
                phone: o.customer?.phone || '',
                isRegistered: false,
                ordersCount: 1,
                totalSpent: total,
                lastOrder: d,
              });
            }
          });
        }
      } catch {}
    }

    let customers = Array.from(customerMap.values());

    if (filter === 'registered') {
      customers = customers.filter((c) => c.isRegistered);
    }

    if (query) {
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          (c.phone && c.phone.includes(query))
      );
    }

    const registeredUsersCount = Array.from(customerMap.values()).filter((c) => c.isRegistered).length;

    return NextResponse.json({
      success: true,
      count: customers.length,
      registeredCount: registeredUsersCount,
      customers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
