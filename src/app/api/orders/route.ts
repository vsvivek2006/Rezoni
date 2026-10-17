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

function formatISTDate(d: Date, opts?: Intl.DateTimeFormatOptions): string {
  try {
    return d.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...opts,
    });
  } catch {
    return d.toLocaleDateString('en-IN', opts);
  }
}

function formatISTShortDate(d: Date): string {
  try {
    return d.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }
}

function formatISTTime(d: Date): string {
  try {
    return d.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
}

function formatISTShortTime(d: Date): string {
  try {
    return d.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).toLowerCase();
  } catch {
    return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
  }
}

function normalizeToOrder(raw: any): Order {
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

  const carrier = raw.carrier || raw.customer?.carrier || 'BlueDart Express';
  const trackingNumber =
    raw.tracking_number ||
    raw.trackingNumber ||
    raw.customer?.trackingNumber ||
    raw.razorpay_order_id ||
    `DELHIVERY-${orderId.replace(/[^0-9]/g, '') || '782109'}`;

  let createdDate = raw.created_at
    ? new Date(raw.created_at)
    : raw.createdAt
    ? new Date(raw.createdAt)
    : raw.date
    ? new Date(raw.date)
    : new Date();
  if (isNaN(createdDate.getTime())) {
    createdDate = new Date();
  }

  const estDate = new Date(createdDate.getTime());
  estDate.setDate(estDate.getDate() + 3);

  const formattedDate = `${formatISTDate(createdDate)}, ${formatISTTime(createdDate)}`;
  const formattedEst = estDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
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

  const rawCustomer = raw.customer || {};
  const rawShipping = raw.shipping_address || raw.shippingAddress || {};
  const statusHistory = rawCustomer.statusHistory || raw.statusHistory || raw.status_history || {};

  const addr =
    rawShipping.address ||
    rawShipping.addressLine1 ||
    [rawCustomer.addressLine1, rawCustomer.addressLine2].filter(Boolean).join(', ') ||
    rawCustomer.address ||
    rawCustomer.street ||
    'Customer Address';

  const city = rawShipping.city || rawCustomer.city || 'Delhi NCR';
  const state = rawShipping.state || rawCustomer.state || 'Delhi';
  const pincode =
    rawShipping.pincode ||
    rawCustomer.pincode ||
    rawShipping.postalCode ||
    rawCustomer.postalCode ||
    '';

  const shippingAddress = {
    address: addr,
    city: city,
    state: state,
    pincode: pincode,
  };

  const deliveryLocationText = addr && addr !== 'Customer Address'
    ? `${addr}, ${city}${pincode ? ` (${pincode})` : ''}`
    : `${city} - Customer Doorstep${pincode ? ` (${pincode})` : ''}`;

  const isDispatched = ['dispatched', 'in_transit', 'out_for_delivery', 'delivered'].includes(status);
  const isInTransit = ['in_transit', 'out_for_delivery', 'delivered'].includes(status);
  const isOut = ['out_for_delivery', 'delivered'].includes(status);
  const isDelivered = status === 'delivered';

  // Realistic stage timestamps derived from authentic creation time or explicit admin statusHistory
  const confirmedTime = createdDate;

  let dispatchTime: Date;
  if (statusHistory.dispatched) {
    dispatchTime = new Date(statusHistory.dispatched);
  } else if (isDispatched) {
    const h = confirmedTime.getHours();
    dispatchTime = new Date(confirmedTime.getTime() + (h >= 19 ? 14 * 3600 * 1000 : 4.5 * 3600 * 1000));
  } else {
    dispatchTime = new Date(confirmedTime.getTime() + 24 * 3600 * 1000);
  }

  let transitTime: Date;
  if (statusHistory.in_transit) {
    transitTime = new Date(statusHistory.in_transit);
  } else if (isInTransit) {
    transitTime = new Date(dispatchTime.getTime() + 14 * 3600 * 1000);
  } else {
    transitTime = new Date(confirmedTime.getTime() + 48 * 3600 * 1000);
  }

  let outTime: Date;
  if (statusHistory.out_for_delivery) {
    outTime = new Date(statusHistory.out_for_delivery);
  } else if (isOut) {
    outTime = new Date(transitTime.getTime() + 18 * 3600 * 1000);
  } else {
    outTime = estDate;
  }

  let deliveredTime: Date;
  if (statusHistory.delivered) {
    deliveredTime = new Date(statusHistory.delivered);
  } else if (isDelivered) {
    deliveredTime = new Date(outTime.getTime() + 4 * 3600 * 1000);
  } else {
    deliveredTime = estDate;
  }

  const timeline = [
    {
      key: 'confirmed',
      title: 'Order Confirmed',
      description: 'Order placed & prepaid payment verified',
      date: formatISTDate(confirmedTime),
      time: formatISTTime(confirmedTime),
      shortDate: formatISTShortDate(confirmedTime),
      shortTime: formatISTShortTime(confirmedTime),
      completed: true,
      current: status === 'confirmed',
      location: 'Rezoni Central Logistics Hub, Gurugram',
    },
    {
      key: 'dispatched',
      title: 'Dispatched & Packed',
      description: isDispatched
        ? `Quality check passed & handed over to ${carrier}`
        : 'Undergoing quality check & UV packaging',
      date: isDispatched ? formatISTDate(dispatchTime) : formatISTDate(dispatchTime),
      time: isDispatched ? formatISTTime(dispatchTime) : 'Within 24 hours',
      shortDate: formatISTShortDate(dispatchTime),
      shortTime: isDispatched ? formatISTShortTime(dispatchTime) : 'Within 24h',
      completed: isDispatched,
      current: status === 'dispatched',
      location: isDispatched ? `${carrier} Dispatch Center, Delhi NCR` : 'Rezoni Fulfillment Center, Gurugram',
    },
    {
      key: 'in_transit',
      title: 'In Transit',
      description: isInTransit
        ? `Shipment en route via ${carrier} express air network`
        : 'Handoff to express delivery air network',
      date: isInTransit ? formatISTDate(transitTime) : formatISTDate(transitTime),
      time: isInTransit ? formatISTTime(transitTime) : 'In 2 days',
      shortDate: formatISTShortDate(transitTime),
      shortTime: isInTransit ? formatISTShortTime(transitTime) : 'In 2 days',
      completed: isInTransit,
      current: status === 'in_transit',
      location: `${carrier} National Air Cargo Hub`,
    },
    {
      key: 'out_for_delivery',
      title: 'Out for Delivery',
      description: isOut
        ? 'Courier executive assigned for doorstep delivery'
        : 'Local courier partner assigned for doorstep delivery',
      date: isOut ? formatISTDate(outTime) : formatISTDate(outTime),
      time: isOut ? formatISTTime(outTime) : '09:00 AM - 01:00 PM',
      shortDate: formatISTShortDate(outTime),
      shortTime: isOut ? formatISTShortTime(outTime) : 'Morning',
      completed: isOut,
      current: status === 'out_for_delivery',
      location: `${city} Delivery Hub`,
    },
    {
      key: 'delivered',
      title: 'Delivered',
      description: isDelivered
        ? 'Delivered safely to doorstep with 6-month product warranty card'
        : 'Direct doorstep contactless delivery with 6-month warranty card',
      date: isDelivered ? formatISTDate(deliveredTime) : formattedEst,
      time: isDelivered ? formatISTTime(deliveredTime) : 'By 07:00 PM',
      shortDate: isDelivered ? formatISTShortDate(deliveredTime) : formatISTShortDate(deliveredTime),
      shortTime: isDelivered ? formatISTShortTime(deliveredTime) : 'By 7 pm',
      completed: isDelivered,
      current: status === 'delivered',
      location: deliveryLocationText,
    },
  ];

  return {
    id: orderId,
    customerEmail: raw.customer_email || rawCustomer.email || raw.customerEmail || '',
    customerPhone: raw.customer_phone || rawCustomer.phone || raw.customerPhone || '',
    customerName: raw.customer_name || rawCustomer.fullName || raw.customerName || 'Rezoni Customer',
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
        .or(`order_id.in.("${targetIds.join('","')}"),id.in.("${targetIds.join('","')}"),razorpay_order_id.eq."${cleanUpper}"`)
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
          .ilike('customer->>phone', `%${last10}`)
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
          .ilike('customer->>email', lowerQuery)
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
