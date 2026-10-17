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

    const supabase = getSupabaseAdminClient();
    const customerMap = new Map<string, any>();

    if (supabase) {
      // 1. Fetch registered users
      const { data: users } = await supabase.from('users').select('*');
      if (users) {
        users.forEach((u) => {
          const email = (u.email || '').toLowerCase();
          customerMap.set(email, {
            id: u.id,
            name: u.name || email.split('@')[0],
            email: u.email,
            phone: '',
            ordersCount: 0,
            totalSpent: 0,
            lastOrder: u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A',
          });
        });
      }

      // 2. Fetch orders to aggregate spend
      const { data: orders } = await supabase.from('orders').select('*');
      if (orders) {
        orders.forEach((o) => {
          const email = (o.customer_email || 'guest@rezoni.com').toLowerCase();
          const existing = customerMap.get(email);
          const orderTotal = Number(o.total_amount) || 0;
          const orderDate = o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Recent';

          if (existing) {
            existing.ordersCount += 1;
            existing.totalSpent += orderTotal;
            existing.lastOrder = orderDate;
            if (o.customer_name && existing.name.includes('@')) existing.name = o.customer_name;
            if (o.customer_phone) existing.phone = o.customer_phone;
          } else {
            customerMap.set(email, {
              name: o.customer_name || email.split('@')[0],
              email: o.customer_email,
              phone: o.customer_phone || '',
              ordersCount: 1,
              totalSpent: orderTotal,
              lastOrder: orderDate,
            });
          }
        });
      }
    }

    // Fallback if 0
    if (customerMap.size === 0) {
      try {
        const localPath = fs.existsSync(path.resolve(process.cwd(), 'src', 'data', 'db.json'))
          ? path.resolve(process.cwd(), 'src', 'data', 'db.json')
          : path.resolve(process.cwd(), '..', 'src', 'data', 'db.json');
        if (fs.existsSync(localPath)) {
          const raw = JSON.parse(fs.readFileSync(localPath, 'utf8'));
          (raw.users || []).forEach((u: any) => {
            const email = (u.email || '').toLowerCase();
            customerMap.set(email, {
              id: u.id,
              name: u.name || email.split('@')[0],
              email: u.email,
              phone: '',
              ordersCount: (u.orders || []).length,
              totalSpent: (u.orders || []).reduce((s: number, o: any) => s + (o.total || 0), 0),
              lastOrder: 'Recent',
            });
          });
        }
      } catch (e) {}
    }

    let customers = Array.from(customerMap.values());

    if (query) {
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          (c.phone && c.phone.includes(query))
      );
    }

    customers.sort((a, b) => b.totalSpent - a.totalSpent);

    return NextResponse.json({ success: true, count: customers.length, customers });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
