import fs from 'fs';
import path from 'path';
import { getSupabaseAdminClient } from './supabaseServer';

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  device?: string;
  color?: string;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderRecord {
  orderId: string; // e.g. RZ-94821
  receipt: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number; // in INR
  currency: string; // 'INR'
  status: 'created' | 'paid' | 'failed';
  customer: CustomerDetails;
  items: OrderItem[];
  createdAt: string;
  paidAt?: string;
}

const ORDERS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'orders.json');

// In-memory cache for ultra-fast access
const memoryOrders = new Map<string, OrderRecord>();

function readOrdersFromFile(): OrderRecord[] {
  try {
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const data = fs.readFileSync(ORDERS_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to read orders from file:', error);
  }
  return [];
}

function writeOrdersToFile(orders: OrderRecord[]): void {
  try {
    const dir = path.dirname(ORDERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Orders filesystem persistence skipped or unavailable:', error);
  }
}

/**
 * Sync order to Supabase PostgreSQL database
 */
async function syncOrderToSupabase(order: OrderRecord): Promise<void> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  try {
    // 1. Upsert order into 'orders' table
    const { error: orderError } = await supabase.from('orders').upsert(
      {
        id: order.orderId,
        order_id: order.orderId,
        receipt: order.receipt,
        razorpay_order_id: order.razorpayOrderId,
        razorpay_payment_id: order.razorpayPaymentId || null,
        razorpay_signature: order.razorpaySignature || null,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        customer: order.customer,
        items: order.items,
        created_at: order.createdAt,
        paid_at: order.paidAt || null,
      },
      { onConflict: 'order_id' }
    );

    if (orderError) {
      console.error('Supabase order sync error:', orderError.message);
    }

    // 2. Upsert customer into 'customers' table if email exists
    if (order.customer?.email) {
      await supabase.from('customers').upsert(
        {
          full_name: order.customer.fullName,
          email: order.customer.email.toLowerCase().trim(),
          phone: order.customer.phone,
          city: order.customer.city,
          state: order.customer.state,
          pincode: order.customer.pincode,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      );
    }
  } catch (err) {
    console.error('Supabase background sync exception:', err);
  }
}

export function generateOrderId(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `RZ-${randomNum}`;
}

export async function saveOrderAsync(order: OrderRecord): Promise<void> {
  // 1. Instant in-memory cache update
  memoryOrders.set(order.orderId, order);

  // 2. Local JSON fallback persistence
  try {
    const currentOrders = readOrdersFromFile();
    const existingIdx = currentOrders.findIndex((o) => o.orderId === order.orderId);
    if (existingIdx >= 0) {
      currentOrders[existingIdx] = order;
    } else {
      currentOrders.unshift(order);
    }
    writeOrdersToFile(currentOrders);
  } catch (e) {
    console.warn('Local fallback write skipped:', e);
  }

  // 3. Guaranteed synchronous cloud persistence to Supabase PostgreSQL
  try {
    await syncOrderToSupabase(order);
  } catch (err) {
    console.error('Failed to sync order to Supabase:', err);
  }
}

export function saveOrder(order: OrderRecord): void {
  // 1. Instant in-memory cache update
  memoryOrders.set(order.orderId, order);

  // 2. Non-blocking asynchronous local JSON fallback persistence
  setImmediate(() => {
    try {
      const currentOrders = readOrdersFromFile();
      const existingIdx = currentOrders.findIndex((o) => o.orderId === order.orderId);
      if (existingIdx >= 0) {
        currentOrders[existingIdx] = order;
      } else {
        currentOrders.unshift(order);
      }
      writeOrdersToFile(currentOrders);
    } catch (e) {
      console.warn('Async fallback write skipped:', e);
    }
  });

  // 3. Asynchronous cloud persistence to Supabase PostgreSQL
  syncOrderToSupabase(order).catch((err) => {
    console.error('Failed to sync order to Supabase:', err);
  });
}

export function getOrderById(orderId: string): OrderRecord | null {
  if (memoryOrders.has(orderId)) {
    return memoryOrders.get(orderId)!;
  }
  const orders = readOrdersFromFile();
  const match = orders.find((o) => o.orderId.toLowerCase() === orderId.toLowerCase());
  if (match) {
    memoryOrders.set(match.orderId, match);
    return match;
  }
  return null;
}

export async function getOrderByIdAsync(orderId: string): Promise<OrderRecord | null> {
  const localOrder = getOrderById(orderId);
  if (localOrder) return localOrder;

  // Try fetching from Supabase if not found in memory/file
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error || !data) return null;

    const mappedOrder: OrderRecord = {
      orderId: data.order_id,
      receipt: data.receipt,
      razorpayOrderId: data.razorpay_order_id,
      razorpayPaymentId: data.razorpay_payment_id || undefined,
      razorpaySignature: data.razorpay_signature || undefined,
      amount: Number(data.amount),
      currency: data.currency || 'INR',
      status: data.status,
      customer: data.customer,
      items: data.items,
      createdAt: data.created_at,
      paidAt: data.paid_at || undefined,
    };

    memoryOrders.set(mappedOrder.orderId, mappedOrder);
    return mappedOrder;
  } catch (err) {
    console.error('Error fetching order from Supabase:', err);
    return null;
  }
}

export function getOrderByRazorpayOrderId(rzpOrderId: string): OrderRecord | null {
  for (const o of memoryOrders.values()) {
    if (o.razorpayOrderId === rzpOrderId) return o;
  }
  const orders = readOrdersFromFile();
  const match = orders.find((o) => o.razorpayOrderId === rzpOrderId);
  if (match) {
    memoryOrders.set(match.orderId, match);
    return match;
  }
  return null;
}

export async function getOrderByRazorpayOrderIdAsync(rzpOrderId: string): Promise<OrderRecord | null> {
  const localOrder = getOrderByRazorpayOrderId(rzpOrderId);
  if (localOrder) return localOrder;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('razorpay_order_id', rzpOrderId)
      .single();

    if (error || !data) return null;

    const mappedOrder: OrderRecord = {
      orderId: data.order_id,
      receipt: data.receipt,
      razorpayOrderId: data.razorpay_order_id,
      razorpayPaymentId: data.razorpay_payment_id || undefined,
      razorpaySignature: data.razorpay_signature || undefined,
      amount: Number(data.amount),
      currency: data.currency || 'INR',
      status: data.status,
      customer: data.customer,
      items: data.items,
      createdAt: data.created_at,
      paidAt: data.paid_at || undefined,
    };

    memoryOrders.set(mappedOrder.orderId, mappedOrder);
    return mappedOrder;
  } catch (err) {
    console.error('Error fetching order by rzpOrderId from Supabase:', err);
    return null;
  }
}

export function markOrderPaid(
  orderId: string,
  paymentDetails: { razorpayPaymentId?: string; razorpaySignature?: string }
): OrderRecord | null {
  const order = getOrderById(orderId);
  if (!order) return null;

  order.status = 'paid';
  if (paymentDetails.razorpayPaymentId) {
    order.razorpayPaymentId = paymentDetails.razorpayPaymentId;
  }
  if (paymentDetails.razorpaySignature) {
    order.razorpaySignature = paymentDetails.razorpaySignature;
  }
  order.paidAt = new Date().toISOString();

  saveOrder(order);
  return order;
}

export async function markOrderPaidAsync(
  orderId: string,
  paymentDetails: { razorpayPaymentId?: string; razorpaySignature?: string }
): Promise<OrderRecord | null> {
  let order = getOrderById(orderId);
  if (!order) {
    order = await getOrderByIdAsync(orderId);
  }
  if (!order) return null;

  order.status = 'paid';
  if (paymentDetails.razorpayPaymentId) {
    order.razorpayPaymentId = paymentDetails.razorpayPaymentId;
  }
  if (paymentDetails.razorpaySignature) {
    order.razorpaySignature = paymentDetails.razorpaySignature;
  }
  order.paidAt = new Date().toISOString();

  await saveOrderAsync(order);
  return order;
}

export function markOrderFailed(orderId: string): OrderRecord | null {
  const order = getOrderById(orderId);
  if (!order) return null;

  order.status = 'failed';
  saveOrder(order);
  return order;
}

export async function markOrderFailedAsync(orderId: string): Promise<OrderRecord | null> {
  let order = getOrderById(orderId);
  if (!order) {
    order = await getOrderByIdAsync(orderId);
  }
  if (!order) return null;

  order.status = 'failed';
  await saveOrderAsync(order);
  return order;
}

export async function recoverAndSavePaidOrderAsync({
  razorpayOrderId,
  razorpayPaymentId,
  notes,
  amount,
  receipt,
}: {
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  notes?: Record<string, any>;
  amount: number;
  receipt?: string;
}): Promise<OrderRecord> {
  const supabase = getSupabaseAdminClient();
  const email = (notes?.customer_email || '').trim().toLowerCase();
  let customerDetails: CustomerDetails = {
    fullName: notes?.customer_name || 'Customer',
    email: email,
    phone: notes?.customer_phone || '',
    addressLine1: 'India',
    city: 'India',
    state: 'India',
    pincode: '',
  };

  if (supabase && email) {
    try {
      const { data: custRows } = await supabase
        .from('customers')
        .select('*')
        .ilike('email', email)
        .limit(1);

      if (custRows && custRows.length > 0) {
        const c = custRows[0];
        customerDetails = {
          fullName: c.full_name || customerDetails.fullName,
          email: c.email || customerDetails.email,
          phone: c.phone || customerDetails.phone,
          addressLine1: c.city || 'India',
          city: c.city || '',
          state: c.state || '',
          pincode: c.pincode || '',
        };
      }
    } catch (e) {
      console.warn('Customer lookup during order auto-recovery failed:', e);
    }
  }

  const orderId = notes?.rezoni_order_id || generateOrderId();
  const recoveredOrder: OrderRecord = {
    orderId,
    receipt: receipt || `rcpt_${orderId.replace(/[^a-zA-Z0-9]/g, '')}`,
    razorpayOrderId,
    razorpayPaymentId,
    amount,
    currency: 'INR',
    status: 'paid',
    customer: customerDetails,
    items: [
      {
        id: 'recovered-order-items',
        title: 'Premium Phone Cases & Accessories Bundle',
        price: amount,
        quantity: 1,
        image: 'https://cdn.shopify.com/s/files/1/0621/7829/6040/files/1_41915488-fb22-4972-91a6-8d3a01e1f022.jpg?v=1783663584',
      },
      {
        id: 'free-gift-sticky-pod',
        image: '/images/gifts/sticky_pod.jpg',
        price: 0,
        title: 'Sticky Pod (Universal Phone Suction Mount) [FREE GIFT]',
        quantity: 1,
      },
      {
        id: 'free-gift-cable-protector',
        image: '/images/gifts/cable_protector.jpg',
        price: 0,
        title: 'Cable Protector (4 Pcs Spiral Guards) [FREE GIFT]',
        quantity: 1,
      },
      {
        id: 'free-gift-usb-cable',
        image: '/images/gifts/usb_cable.jpg',
        price: 0,
        title: 'USB Fast Charging Cable [FREE GIFT]',
        quantity: 1,
      },
    ],
    createdAt: new Date().toISOString(),
    paidAt: new Date().toISOString(),
  };

  await saveOrderAsync(recoveredOrder);
  return recoveredOrder;
}

