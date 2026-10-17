import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabaseServer';
import { getAllOrders, getOrderByIdOrQuery, createNewOrder, Order } from '@/lib/db';
import fs from 'fs';
import path from 'path';

function readOrdersFromOrderStore(): any[] {
  try {
    const ordersFilePath = path.join(process.cwd(), 'src', 'data', 'orders.json');
    if (fs.existsSync(ordersFilePath)) {
      return JSON.parse(fs.readFileSync(ordersFilePath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading orders.json:', err);
  }
  return [];
}

function normalizeToOrder(raw: any): Order {
  // If it's already a complete Order schema with timeline
  if (raw.timeline && raw.timeline.length > 0 && raw.carrier && raw.statusLabel) {
    return raw as Order;
  }

  const orderId = raw.order_id || raw.id || raw.orderId || 'RZ-10001';
  const rawStatus = (raw.order_status || raw.status || 'confirmed').toLowerCase();

  let status: Order['status'] = 'confirmed';
  if (['dispatched', 'in_transit', 'out_for_delivery', 'delivered'].includes(rawStatus)) {
    status = rawStatus as Order['status'];
  } else {
    status = 'confirmed';
  }

  const statusLabelMap: Record<Order['status'], string> = {
    confirmed: 'Order Confirmed - Preparing for Dispatch',
    dispatched: 'Dispatched - Handed over to Logistics',
    in_transit: 'In Transit - Moving to Delivery Hub',
    out_for_delivery: 'Out for Delivery - Arriving Today',
    delivered: 'Delivered Successfully',
  };

  const carrier = raw.carrier || 'Delhivery Express';
  const trackingNumber =
    raw.tracking_number ||
    raw.trackingNumber ||
    `DELHIVERY-${orderId.replace(/[^0-9]/g, '') || '782109'}`;

  const createdDate = raw.created_at
    ? new Date(raw.created_at)
    : raw.createdAt
    ? new Date(raw.createdAt)
    : new Date();
  const estDate = new Date(createdDate.getTime());
  estDate.setDate(estDate.getDate() + 3);

  const formattedDate = createdDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedEst = estDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Map Items (including products & any free gifts)
  const items = (raw.items || []).map((it: any) => ({
    title: it.title || 'Rezoni Designer Case',
    model: it.model || it.device || 'Standard Fit',
    variant: it.variant || it.color || 'Clear UV',
    price: Number(it.price || 0),
    quantity: Number(it.quantity || 1),
    image:
      it.image ||
      'https://cdn.shopify.com/s/files/1/0621/7829/6040/files/1_87635ba5-31c5-4d04-99ef-e9d35aa351b3.jpg?v=1725349229',
  }));

  const isDispatched = ['dispatched', 'in_transit', 'out_for_delivery', 'delivered'].includes(status);
  const isInTransit = ['in_transit', 'out_for_delivery', 'delivered'].includes(status);
  const isOut = ['out_for_delivery', 'delivered'].includes(status);
  const isDelivered = status === 'delivered';

  const timeline = [
    {
      title: 'Order Confirmed',
      description: 'Order placed & prepaid payment verified',
      date: formattedDate,
      time: '10:00 AM',
      completed: true,
      current: status === 'confirmed',
      location: 'Rezoni Central Hub, Gurugram',
    },
    {
      title: 'Dispatched & Packed',
      description: 'Undergoing quality check & UV packaging',
      date: isDispatched ? formattedDate : 'Upcoming',
      time: isDispatched ? '04:30 PM' : 'Within 24 hours',
      completed: isDispatched,
      current: status === 'dispatched',
      location: 'Delhi Central Logistics Hub',
    },
    {
      title: 'In Transit',
      description: 'Handoff to express delivery air network',
      date: isInTransit ? 'Today' : 'Upcoming',
      time: isInTransit ? '06:00 AM' : 'In 2 days',
      completed: isInTransit,
      current: status === 'in_transit',
      location: 'Express Air Hub',
    },
    {
      title: 'Out for Delivery',
      description: 'Courier executive assigned for doorstep delivery',
      date: isOut ? 'Today' : 'Upcoming',
      time: isOut ? '08:45 AM' : 'Expected',
      completed: isOut,
      current: status === 'out_for_delivery',
      location: raw.shipping_address?.city || raw.customer?.city || 'Local Delivery Van',
    },
    {
      title: 'Delivered',
      description: 'Direct doorstep contactless delivery with 6-month warranty card',
      date: isDelivered ? 'Today' : formattedEst,
      time: isDelivered ? '02:15 PM' : 'By 07:00 PM',
      completed: isDelivered,
      current: status === 'delivered',
      location: 'Shipping Address',
    },
  ];

  let shippingAddress = {
    address: 'Customer Address Provided',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
  };

  if (raw.shipping_address) {
    shippingAddress = {
      address:
        raw.shipping_address.address ||
        raw.shipping_address.addressLine1 ||
        'Customer Address',
      city: raw.shipping_address.city || 'Delhi',
      state: raw.shipping_address.state || 'Delhi',
      pincode: raw.shipping_address.pincode || '',
    };
  } else if (raw.customer) {
    shippingAddress = {
      address:
        [raw.customer.addressLine1, raw.customer.addressLine2].filter(Boolean).join(', ') ||
        'Customer Address',
      city: raw.customer.city || '',
      state: raw.customer.state || '',
      pincode: raw.customer.pincode || '',
    };
  }

  return {
    id: orderId,
    customerEmail: raw.customer_email || raw.customer?.email || raw.customerEmail || '',
    customerPhone: raw.customer_phone || raw.customer?.phone || raw.customerPhone || '',
    customerName: raw.customer_name || raw.customer?.fullName || raw.customerName || 'Rezoni Customer',
    date: formattedDate,
    total: Number(raw.total_amount || raw.amount || raw.total || 0),
    status,
    statusLabel: statusLabelMap[status],
    carrier,
    trackingNumber,
    estimatedDelivery: formattedEst,
    shippingAddress,
    items,
    timeline,
  };
}

async function findUnifiedOrder(query: string): Promise<Order | null> {
  const clean = query.trim();
  if (!clean || clean.length < 4) return null;

  const cleanUpper = clean.toUpperCase().replace(/^#/, '');
  const digits = clean.replace(/[^0-9]/g, '');
  const lowerQuery = clean.toLowerCase();

  // Guard against short random inputs: if not at least 4 alphanumeric chars and not 10 digits
  if (cleanUpper.length < 4 && digits.length < 5) {
    return null;
  }

  // 1. Check Supabase DB orders table
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      // 1a. Exact order ID or AWB tracking number match
      const targetIds = [cleanUpper, `RZ-${cleanUpper}`];
      const { data: exactMatches } = await supabase
        .from('orders')
        .select('*')
        .or(`order_id.in.("${targetIds.join('","')}"),id.in.("${targetIds.join('","')}"),tracking_number.eq."${cleanUpper}"`)
        .limit(1);

      if (exactMatches && exactMatches.length > 0) {
        return normalizeToOrder(exactMatches[0]);
      }

      // 1b. Exact 10-digit phone match
      if (digits.length >= 10) {
        const last10 = digits.slice(-10);
        const { data: phoneMatches } = await supabase
          .from('orders')
          .select('*')
          .ilike('customer_phone', `%${last10}`)
          .limit(1);

        if (phoneMatches && phoneMatches.length > 0) {
          return normalizeToOrder(phoneMatches[0]);
        }
      }

      // 1c. Exact email match
      if (lowerQuery.includes('@')) {
        const { data: emailMatches } = await supabase
          .from('orders')
          .select('*')
          .ilike('customer_email', lowerQuery)
          .limit(1);

        if (emailMatches && emailMatches.length > 0) {
          return normalizeToOrder(emailMatches[0]);
        }
      }
    } catch (sbErr) {
      console.warn('Supabase order tracking query skipped/failed:', sbErr);
    }
  }

  // 2. Check orders.json (Razorpay store)
  const storeOrders = readOrdersFromOrderStore();
  const storeMatch = storeOrders.find((o) => {
    const oId = (o.orderId || '').toUpperCase().replace(/^#/, '');
    if (oId === cleanUpper || oId === `RZ-${cleanUpper}`) return true;
    if (o.receipt && o.receipt.toUpperCase() === cleanUpper) return true;
    if (o.razorpayOrderId && o.razorpayOrderId.toUpperCase() === cleanUpper) return true;
    if (digits.length >= 10 && o.customer?.phone) {
      const pDigits = o.customer.phone.replace(/[^0-9]/g, '');
      if (pDigits.length >= 10 && pDigits.slice(-10) === digits.slice(-10)) return true;
    }
    if (lowerQuery.includes('@') && o.customer?.email && o.customer.email.toLowerCase() === lowerQuery) return true;
    return false;
  });

  if (storeMatch) {
    return normalizeToOrder(storeMatch);
  }

  // 3. Check db.json
  const dbMatch = getOrderByIdOrQuery(query);
  if (dbMatch) {
    return normalizeToOrder(dbMatch);
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || searchParams.get('id') || searchParams.get('trackingNumber');

    if (query) {
      const order = await findUnifiedOrder(query);
      if (!order) {
        return NextResponse.json(
          {
            success: false,
            message: `No shipment found for "${query}". Please check the Order ID, Phone Number, or Tracking Number.`,
          },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, order });
    }

    const all = getAllOrders();
    return NextResponse.json({ success: true, orders: all });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerEmail, customerName, customerPhone, items, total, shippingAddress } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order must contain at least one item.' },
        { status: 400 }
      );
    }

    const order = createNewOrder({
      customerEmail: customerEmail || 'guest@rezoni.com',
      customerName: customerName || 'Valued Customer',
      customerPhone: customerPhone || '',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      total: Number(total || 299),
      shippingAddress: shippingAddress || {
        address: 'Delivery Address Provided',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
      },
      items,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Order placed and confirmed successfully!',
        order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
