import fs from 'fs';
import path from 'path';
import { getSupabaseAdminClient } from './supabaseServer';

async function syncToSupabase(table: string, payload: any) {
  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) return;
    await supabase.from(table).upsert(payload);
  } catch (err) {
    console.error(`Supabase background sync exception for ${table}:`, err);
  }
}

export interface OrderItem {
  title: string;
  model?: string;
  variant?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface TimelineStep {
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
  current?: boolean;
  location: string;
}

export interface Order {
  id: string; // e.g. "RZ-84920"
  userId?: string;
  customerEmail: string;
  customerPhone?: string;
  customerName?: string;
  date: string;
  total: number;
  status: 'confirmed' | 'dispatched' | 'in_transit' | 'out_for_delivery' | 'delivered';
  statusLabel: string;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  timeline: TimelineStep[];
}

export interface ReturnRequest {
  id: string; // e.g. "RET-8419"
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  reason: string;
  status: 'requested' | 'approved' | 'in_inspection' | 'refunded' | 'rejected';
  statusLabel?: string;
  amount: number;
  date: string;
  items: string;
  trackingNumber?: string;
  notes?: string;
}

export interface UserReview {
  id: string;
  userId?: string;
  userEmail: string;
  userName: string;
  productTitle: string;
  model?: string;
  rating: number;
  body: string;
  date: string;
  image?: string | null;
}

export interface User {
  id: string;
  email: string;
  password: string; // stored for credentials verification
  name: string;
  createdAt: string;
  orders: Order[];
  reviews: UserReview[];
}

interface DatabaseSchema {
  users: User[];
  orders: Order[];
  reviews: UserReview[];
  returns: ReturnRequest[];
}

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

// Default sample orders for demonstration & instant tracking test
const initialOrders: Order[] = [
  {
    id: 'RZ-84920',
    customerEmail: 'demo@rezoni.com',
    customerPhone: '+91 98765 43210',
    customerName: 'Aman Sharma',
    date: 'October 15, 2026',
    total: 699,
    status: 'in_transit',
    statusLabel: 'In Transit - Hub In Scan',
    carrier: 'BlueDart Express',
    trackingNumber: 'BLUEDART-849203810',
    estimatedDelivery: 'Tuesday, October 20, 2026',
    shippingAddress: {
      address: 'Flat 402, Sunshine Heights, Sector 45',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122003',
    },
    items: [
      {
        title: 'Anti-Yellow Magsafe Clear Case',
        model: 'Galaxy Z Flip6',
        variant: 'MagSafe',
        price: 699,
        quantity: 1,
        image: 'https://cdn.shopify.com/s/files/1/0621/7829/6040/files/1_4a28e8fa-edaa-4bad-8709-5781b9988034.jpg?v=1755339220',
      },
    ],
    timeline: [
      {
        title: 'Order Confirmed',
        description: 'Order placed and verified by Rezoni team',
        date: 'Oct 15, 2026',
        time: '03:45 PM',
        completed: true,
        location: 'Rezoni Head Office, Gurugram',
      },
      {
        title: 'Dispatched & Packed',
        description: 'Packed with 4-corner drop-test shock cushioning',
        date: 'Oct 16, 2026',
        time: '11:00 AM',
        completed: true,
        location: 'Rezoni Fulfillment Center, Delhi NCR',
      },
      {
        title: 'In Transit',
        description: 'Package scanned at sorting center. In transit with BlueDart Express.',
        date: 'Oct 17, 2026',
        time: '07:30 AM',
        completed: true,
        current: true,
        location: 'Delhi Sorting Hub - In Scan',
      },
      {
        title: 'Out for Delivery',
        description: 'Courier delivery agent will contact you before delivery',
        date: 'Oct 19, 2026',
        time: 'Expected',
        completed: false,
        location: 'Destination Delivery Station',
      },
      {
        title: 'Delivered',
        description: 'Direct doorstep contactless delivery',
        date: 'Oct 20, 2026',
        time: 'Expected',
        completed: false,
        location: 'Shipping Address',
      },
    ],
  },
  {
    id: 'RZ-78210',
    customerEmail: 'rohit@example.com',
    customerPhone: '+91 91234 56789',
    customerName: 'Rohit Verma',
    date: 'October 16, 2026',
    total: 1398,
    status: 'out_for_delivery',
    statusLabel: 'Out for Delivery',
    carrier: 'Delhivery Express',
    trackingNumber: 'DELHIVERY-782109923',
    estimatedDelivery: 'Today by 06:00 PM',
    shippingAddress: {
      address: 'B-12, Kailash Colony',
      city: 'South Delhi',
      state: 'Delhi',
      pincode: '110048',
    },
    items: [
      {
        title: 'Anti-Yellow Magsafe Clear Case',
        model: 'iPhone 16 Pro Max',
        variant: 'MagSafe',
        price: 699,
        quantity: 1,
        image: 'https://cdn.shopify.com/s/files/1/0621/7829/6040/files/16pm_magsafe_1_7b41bf92-c72a-4b4b-b6b5-8a842f151548.jpg?v=1742899832',
      },
      {
        title: 'Anti-Yellow Clear Case',
        model: 'OnePlus 12',
        variant: 'Non-MagSafe',
        price: 699,
        quantity: 1,
        image: 'https://cdn.shopify.com/s/files/1/0621/7829/6040/files/1_fa85aa40-258a-4f2d-840c-a6b341bc2034.jpg?v=1755940658',
      },
    ],
    timeline: [
      {
        title: 'Order Confirmed',
        description: 'Order placed & prepaid payment verified',
        date: 'Oct 16, 2026',
        time: '09:12 AM',
        completed: true,
        location: 'Rezoni Center',
      },
      {
        title: 'Dispatched',
        description: 'Handed over to Delhivery logistics',
        date: 'Oct 16, 2026',
        time: '04:00 PM',
        completed: true,
        location: 'Delhi Central Hub',
      },
      {
        title: 'In Transit',
        description: 'Arrived at South Delhi Distribution Center',
        date: 'Oct 17, 2026',
        time: '05:30 AM',
        completed: true,
        location: 'Okhla Hub',
      },
      {
        title: 'Out for Delivery',
        description: 'Courier agent Rahul Kumar is out for delivery',
        date: 'Oct 17, 2026',
        time: '08:45 AM',
        completed: true,
        current: true,
        location: 'Kailash Colony Delivery Van',
      },
      {
        title: 'Delivered',
        description: 'Delivered to customer',
        date: 'Oct 17, 2026',
        time: 'Expected 05:00 PM',
        completed: false,
        location: 'Shipping Address',
      },
    ],
  },
];

function readDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialData: DatabaseSchema = {
        users: [],
        orders: initialOrders,
        reviews: [],
        returns: [],
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
      return initialData;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed.returns) parsed.returns = [];
    if (!parsed.orders || parsed.orders.length === 0) {
      parsed.orders = initialOrders;
      fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2), 'utf8');
    }
    return parsed;
  } catch (e) {
    console.error('Error reading database file:', e);
    return {
      users: [],
      orders: initialOrders,
      reviews: [],
      returns: [],
    };
  }
}

function writeDB(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing database file:', e);
  }
}

// User Helpers
export function getUsers(): User[] {
  return readDB().users;
}

export function findUserByEmail(email: string): User | null {
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
}

export function findUserById(id: string): User | null {
  const users = getUsers();
  return users.find((u) => u.id === id) || null;
}

export function createUser(email: string, password: string, name?: string): User {
  const db = readDB();
  const cleanEmail = email.trim().toLowerCase();
  const existing = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('User already registered with this email address');
  }

  const defaultName = name || cleanEmail.split('@')[0];
  const capitalizedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);

  // Generate a welcome initial order for the newly registered user
  const welcomeOrderId = `RZ-${Math.floor(10000 + Math.random() * 90000)}`;
  const welcomeOrder: Order = {
    id: welcomeOrderId,
    customerEmail: cleanEmail,
    customerName: capitalizedName,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    total: 699,
    status: 'confirmed',
    statusLabel: 'Order Confirmed - Processing for Dispatch',
    carrier: 'BlueDart Express',
    trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,
    estimatedDelivery: 'In 2-4 business days',
    shippingAddress: {
      address: 'Shipping Address On File',
      city: 'Customer Location',
      state: 'India',
      pincode: '110001',
    },
    items: [
      {
        title: 'Anti-Yellow Magsafe Clear Case',
        model: 'Galaxy Z Flip6',
        variant: 'MagSafe',
        price: 699,
        quantity: 1,
        image: 'https://cdn.shopify.com/s/files/1/0621/7829/6040/files/1_4a28e8fa-edaa-4bad-8709-5781b9988034.jpg?v=1755339220',
      },
    ],
    timeline: [
      {
        title: 'Order Confirmed',
        description: 'Order successfully registered and assigned to Rezoni warehouse',
        date: 'Today',
        time: 'Just now',
        completed: true,
        current: true,
        location: 'Rezoni Warehouse, Gurugram',
      },
      {
        title: 'Dispatched & Packed',
        description: 'Packed in anti-yellow UV shield protective casing',
        date: 'Upcoming',
        time: 'Tomorrow',
        completed: false,
        location: 'Rezoni Fulfillment Center',
      },
      {
        title: 'In Transit',
        description: 'In transit via Express Air delivery',
        date: 'Upcoming',
        time: 'In 2 days',
        completed: false,
        location: 'Courier Network',
      },
      {
        title: 'Delivered',
        description: 'Delivered safely to doorstep',
        date: 'Upcoming',
        time: 'In 3-4 days',
        completed: false,
        location: 'Your Address',
      },
    ],
  };

  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    password,
    name: capitalizedName,
    createdAt: new Date().toISOString(),
    orders: [welcomeOrder],
    reviews: [],
  };

  db.users.push(newUser);
  db.orders.unshift(welcomeOrder);
  writeDB(db);

  syncToSupabase('users', {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    password: newUser.password,
    created_at: newUser.createdAt,
    raw_data: newUser,
  });

  syncToSupabase('orders', {
    order_id: welcomeOrder.id,
    customer_name: welcomeOrder.customerName || 'Rezoni Customer',
    customer_email: welcomeOrder.customerEmail,
    customer_phone: welcomeOrder.customerPhone || '',
    shipping_address: welcomeOrder.shippingAddress,
    items: welcomeOrder.items,
    total_amount: welcomeOrder.total,
    payment_method: 'Prepaid / Online',
    order_status: welcomeOrder.status,
    tracking_number: welcomeOrder.trackingNumber,
    carrier: welcomeOrder.carrier,
    created_at: new Date().toISOString(),
  });

  return newUser;
}

// Order Helpers
export function getAllOrders(): Order[] {
  return readDB().orders;
}

export function getOrderByIdOrQuery(query: string): Order | null {
  const clean = query.trim().toUpperCase().replace('#', '');
  const orders = getAllOrders();

  // Try exact match on ID
  const direct = orders.find((o) => o.id.toUpperCase().replace('#', '') === clean);
  if (direct) return direct;

  // Try matching phone, tracking number, or email
  const lowerQuery = query.trim().toLowerCase();
  return (
    orders.find(
      (o) =>
        o.trackingNumber.toLowerCase().includes(lowerQuery) ||
        o.customerEmail.toLowerCase() === lowerQuery ||
        (o.customerPhone && o.customerPhone.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, '')))
    ) || null
  );
}

export function createNewOrder(orderData: Omit<Order, 'id' | 'timeline' | 'status' | 'statusLabel' | 'carrier' | 'trackingNumber' | 'estimatedDelivery'>): Order {
  const db = readDB();
  const orderId = `RZ-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date();
  const estDate = new Date();
  estDate.setDate(now.getDate() + 3);

  const newOrder: Order = {
    ...orderData,
    id: orderId,
    status: 'confirmed',
    statusLabel: 'Order Confirmed - Preparing for Dispatch',
    carrier: 'BlueDart Express',
    trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,
    estimatedDelivery: estDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    timeline: [
      {
        title: 'Order Confirmed',
        description: 'Order placed & prepaid payment verified',
        date: 'Today',
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: true,
        location: 'Rezoni Central Hub',
      },
      {
        title: 'Dispatched & Packed',
        description: 'Undergoing quality check & UV packaging',
        date: 'Upcoming',
        time: 'Within 24 hours',
        completed: false,
        location: 'Rezoni Fulfillment Center, Delhi NCR',
      },
      {
        title: 'In Transit',
        description: 'Handoff to express courier flight',
        date: 'Upcoming',
        time: 'Day 2',
        completed: false,
        location: 'BlueDart Air Hub',
      },
      {
        title: 'Delivered',
        description: 'Doorstep delivery with anti-yellow warranty card',
        date: estDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: 'By 07:00 PM',
        completed: false,
        location: orderData.shippingAddress.address,
      },
    ],
  };

  db.orders.unshift(newOrder);

  // If user exists for customerEmail, attach order to user
  if (orderData.customerEmail) {
    const user = db.users.find((u) => u.email.toLowerCase() === orderData.customerEmail.toLowerCase());
    if (user) {
      user.orders.unshift(newOrder);
    }
  }

  writeDB(db);

  syncToSupabase('orders', {
    order_id: newOrder.id,
    customer_name: newOrder.customerName || 'Rezoni Customer',
    customer_email: newOrder.customerEmail,
    customer_phone: newOrder.customerPhone || '',
    shipping_address: newOrder.shippingAddress,
    items: newOrder.items,
    total_amount: newOrder.total,
    payment_method: 'Prepaid / Online',
    order_status: newOrder.status,
    tracking_number: newOrder.trackingNumber,
    carrier: newOrder.carrier,
    created_at: new Date().toISOString(),
  });

  return newOrder;
}

// Review Helpers
export function getAllSavedReviews(): UserReview[] {
  return readDB().reviews;
}

export function saveUserReview(review: Omit<UserReview, 'id' | 'date'>): UserReview {
  const db = readDB();
  const newRev: UserReview = {
    ...review,
    id: `rev_${Date.now()}`,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  };

  db.reviews.unshift(newRev);

  if (review.userEmail) {
    const user = db.users.find((u) => u.email.toLowerCase() === review.userEmail.toLowerCase());
    if (user) {
      user.reviews.unshift(newRev);
    }
  }

  writeDB(db);

  syncToSupabase('reviews', {
    id: newRev.id,
    product_id: 'anti-yellow-magsafe-clear-case',
    product_title: newRev.productTitle || 'Anti-Yellow Magsafe Clear Case',
    customer_name: newRev.userName,
    customer_email: newRev.userEmail || '',
    rating: newRev.rating,
    body: newRev.body,
    verified: true,
    created_at: new Date().toISOString(),
  });

  return newRev;
}

// ================= ADMIN & CRM CORE HELPERS =================
export function getAllOrdersAdmin(): Order[] {
  return readDB().orders || [];
}

export function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  statusLabel?: string
): Order | null {
  const db = readDB();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;

  order.status = status;
  const labels: Record<Order['status'], string> = {
    confirmed: 'Order Confirmed - Processing for Dispatch',
    dispatched: 'Dispatched & Packed - Handoff to Courier',
    in_transit: 'In Transit - Out for Hub Sorting',
    out_for_delivery: 'Out for Delivery - Agent will contact you',
    delivered: 'Delivered Successfully to Customer',
  };
  order.statusLabel = statusLabel || labels[status] || status;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (order.timeline) {
    order.timeline.forEach((step) => {
      step.current = false;
    });

    if (status === 'dispatched') {
      const step = order.timeline.find((s) => s.title.includes('Dispatched'));
      if (step) { step.completed = true; step.current = true; step.date = dateStr; step.time = timeStr; }
    } else if (status === 'in_transit') {
      order.timeline.forEach((s) => {
        if (s.title.includes('Confirmed') || s.title.includes('Dispatched')) s.completed = true;
      });
      const step = order.timeline.find((s) => s.title.includes('Transit'));
      if (step) { step.completed = true; step.current = true; step.date = dateStr; step.time = timeStr; }
    } else if (status === 'out_for_delivery') {
      order.timeline.forEach((s) => {
        if (!s.title.includes('Delivered')) s.completed = true;
      });
      const step = order.timeline.find((s) => s.title.includes('Out for Delivery'));
      if (step) { step.completed = true; step.current = true; step.date = dateStr; step.time = timeStr; }
    } else if (status === 'delivered') {
      order.timeline.forEach((s) => { s.completed = true; s.current = false; });
      const step = order.timeline.find((s) => s.title.includes('Delivered'));
      if (step) { step.completed = true; step.current = true; step.date = dateStr; step.time = timeStr; }
    }
  }

  if (order.customerEmail) {
    const user = db.users.find((u) => u.email.toLowerCase() === order.customerEmail.toLowerCase());
    if (user && user.orders) {
      const uOrder = user.orders.find((o) => o.id === orderId);
      if (uOrder) {
        Object.assign(uOrder, order);
      }
    }
  }

  writeDB(db);

  syncToSupabase('orders', {
    order_id: order.id,
    customer_name: order.customerName || 'Rezoni Customer',
    customer_email: order.customerEmail,
    customer_phone: order.customerPhone || '',
    shipping_address: order.shippingAddress,
    items: order.items,
    total_amount: order.total,
    payment_method: 'Prepaid / Online',
    order_status: order.status,
    tracking_number: order.trackingNumber,
    carrier: order.carrier,
    created_at: new Date().toISOString(),
  });

  return order;
}

export function updateOrderTracking(
  orderId: string,
  carrier: string,
  trackingNumber: string
): Order | null {
  const db = readDB();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;

  order.carrier = carrier;
  order.trackingNumber = trackingNumber;

  if (order.customerEmail) {
    const user = db.users.find((u) => u.email.toLowerCase() === order.customerEmail.toLowerCase());
    if (user && user.orders) {
      const uOrder = user.orders.find((o) => o.id === orderId);
      if (uOrder) {
        uOrder.carrier = carrier;
        uOrder.trackingNumber = trackingNumber;
      }
    }
  }

  writeDB(db);

  syncToSupabase('orders', {
    order_id: order.id,
    customer_name: order.customerName || 'Rezoni Customer',
    customer_email: order.customerEmail,
    customer_phone: order.customerPhone || '',
    shipping_address: order.shippingAddress,
    items: order.items,
    total_amount: order.total,
    payment_method: 'Prepaid / Online',
    order_status: order.status,
    tracking_number: order.trackingNumber,
    carrier: order.carrier,
    created_at: new Date().toISOString(),
  });

  return order;
}

export function getAllReturns(): ReturnRequest[] {
  const db = readDB();
  return db.returns || [];
}

export function createReturnRequest(
  data: Omit<ReturnRequest, 'id' | 'date' | 'status'> & { status?: ReturnRequest['status'] }
): ReturnRequest {
  const db = readDB();
  if (!db.returns) db.returns = [];

  const newReturn: ReturnRequest = {
    ...data,
    id: `RET-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    status: data.status || 'requested',
    statusLabel: 'Return Initiated - Awaiting QC Review',
  };

  db.returns.unshift(newReturn);
  writeDB(db);

  syncToSupabase('returns', {
    id: newReturn.id,
    order_id: newReturn.orderId,
    customer_name: newReturn.customerName,
    customer_email: newReturn.customerEmail,
    customer_phone: newReturn.customerPhone || '',
    reason: newReturn.reason,
    item_title: newReturn.items,
    model: '',
    variant: '',
    amount: newReturn.amount,
    status: newReturn.status,
    status_label: newReturn.statusLabel,
    notes: newReturn.notes || '',
    created_at: new Date().toISOString(),
  });

  return newReturn;
}

export function updateReturnStatus(
  returnId: string,
  status: ReturnRequest['status'],
  notes?: string
): ReturnRequest | null {
  const db = readDB();
  if (!db.returns) return null;
  const ret = db.returns.find((r) => r.id === returnId);
  if (!ret) return null;

  ret.status = status;
  if (notes) ret.notes = notes;

  const labels: Record<ReturnRequest['status'], string> = {
    requested: 'Return Requested - Pending Review',
    approved: 'Return Approved - Pickup Scheduled',
    in_inspection: 'Package Received - Under QC Inspection',
    refunded: 'Refund Processed to Original Payment Method',
    rejected: 'Return Request Declined',
  };
  ret.statusLabel = labels[status] || status;

  writeDB(db);

  syncToSupabase('returns', {
    id: ret.id,
    order_id: ret.orderId,
    customer_name: ret.customerName,
    customer_email: ret.customerEmail,
    customer_phone: ret.customerPhone || '',
    reason: ret.reason,
    item_title: ret.items,
    model: '',
    variant: '',
    amount: ret.amount,
    status: ret.status,
    status_label: ret.statusLabel,
    notes: ret.notes || '',
    created_at: new Date().toISOString(),
  });

  return ret;
}

export function deleteCustomerReview(reviewId: string): boolean {
  const db = readDB();
  const initialLength = db.reviews.length;
  db.reviews = db.reviews.filter((r) => r.id !== reviewId);
  if (db.reviews.length !== initialLength) {
    writeDB(db);
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        supabase.from('reviews').delete().eq('id', reviewId).then(() => {});
      }
    } catch (e) {}
    return true;
  }
  return false;
}

export function getAdminMetrics() {
  const db = readDB();
  const orders = db.orders || [];
  const returns = db.returns || [];
  const users = db.users || [];
  const reviews = db.reviews || [];

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalReturns = returns.length;
  const totalRefunded = returns
    .filter((r) => r.status === 'refunded')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const confirmedCount = orders.filter((o) => o.status === 'confirmed').length;
  const dispatchedCount = orders.filter((o) => o.status === 'dispatched').length;
  const inTransitCount = orders.filter((o) => o.status === 'in_transit').length;
  const outForDeliveryCount = orders.filter((o) => o.status === 'out_for_delivery').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const distinctEmails = new Set(orders.map((o) => o.customerEmail.toLowerCase()));
  const totalCustomers = Math.max(distinctEmails.size, users.length);

  return {
    totalOrders,
    totalRevenue,
    netRevenue: totalRevenue - totalRefunded,
    totalReturns,
    totalRefunded,
    pendingDispatches: confirmedCount,
    dispatchedCount,
    inTransitCount,
    outForDeliveryCount,
    deliveredCount,
    averageOrderValue,
    totalCustomers,
    totalReviews: reviews.length,
  };
}
