const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
const content = fs.readFileSync(envPath, 'utf8');
const env = {};
content.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const eq = trimmed.indexOf('=');
    if (eq !== -1) env[trimmed.substring(0, eq).trim()] = trimmed.substring(eq + 1).trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials missing in .env.local!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Read local db.json
const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

async function seedSupabase() {
  console.log('--- STARTING COMPREHENSIVE SUPABASE & DB SEEDING ---');
  console.log('Connected to Supabase Project:', supabaseUrl);

  // --- SEED USERS ---
  console.log('\n1. Seeding Users to Supabase...');
  for (const user of db.users || []) {
    const { error } = await supabase.from('users').upsert({
      id: user.id,
      email: user.email.toLowerCase().trim(),
      password: user.password,
      name: user.name,
      created_at: user.createdAt || new Date().toISOString()
    }, { onConflict: 'id' });
    if (error) console.error(`Error syncing user ${user.email}:`, error.message);
    else console.log(`✓ User synced: ${user.email}`);
  }

  // --- SEED ORDERS ---
  console.log('\n2. Seeding Orders to Supabase...');
  for (const order of db.orders || []) {
    const { error } = await supabase.from('orders').upsert({
      id: order.id,
      order_id: order.id,
      receipt: `rcpt_${order.id}`,
      razorpay_order_id: order.trackingNumber || `order_${order.id}`,
      amount: order.total,
      currency: 'INR',
      status: order.status === 'delivered' ? 'paid' : (order.status === 'confirmed' ? 'paid' : order.status),
      customer: {
        fullName: order.customerName || 'Valued Customer',
        email: order.customerEmail || 'customer@rezoni.com',
        phone: order.customerPhone || '',
        addressLine1: order.shippingAddress ? order.shippingAddress.address : 'Address on file',
        city: order.shippingAddress ? order.shippingAddress.city : 'Delhi',
        state: order.shippingAddress ? order.shippingAddress.state : 'Delhi',
        pincode: order.shippingAddress ? order.shippingAddress.pincode : '110001',
      },
      items: order.items,
      created_at: new Date().toISOString()
    }, { onConflict: 'order_id' });
    if (error) console.error(`Error syncing order ${order.id}:`, error.message);
    else console.log(`✓ Order synced: ${order.id} (Rs. ${order.total})`);

    // Also sync customer to customers table
    if (order.customerEmail) {
      await supabase.from('customers').upsert({
        full_name: order.customerName || 'Valued Customer',
        email: order.customerEmail.toLowerCase().trim(),
        phone: order.customerPhone || '',
        city: order.shippingAddress ? order.shippingAddress.city : '',
        state: order.shippingAddress ? order.shippingAddress.state : '',
        pincode: order.shippingAddress ? order.shippingAddress.pincode : '',
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' });
    }
  }

  // --- SEED RETURNS ---
  console.log('\n3. Seeding Returns & Claims to Supabase...');
  for (const ret of db.returns || []) {
    const { error } = await supabase.from('returns').upsert({
      id: ret.id,
      order_id: ret.orderId,
      customer_name: ret.customerName,
      customer_email: ret.customerEmail,
      customer_phone: ret.customerPhone || '',
      reason: ret.reason,
      status: ret.status,
      status_label: ret.statusLabel || ret.status,
      amount: ret.amount,
      date: ret.date,
      items: ret.items,
      tracking_number: ret.trackingNumber || '',
      notes: ret.notes || '',
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    if (error) console.error(`Error syncing return ${ret.id}:`, error.message);
    else console.log(`✓ Return synced: ${ret.id} (${ret.status})`);
  }

  // --- SEED REVIEWS ---
  console.log('\n4. Seeding Reviews to Supabase...');
  for (const rev of db.reviews || []) {
    const { error } = await supabase.from('reviews').upsert({
      id: rev.id,
      user_name: rev.userName,
      user_email: rev.userEmail,
      product_title: rev.productTitle,
      model: rev.model || '',
      rating: rev.rating,
      body: rev.body,
      date: rev.date,
      image: rev.image || null,
      created_at: new Date().toISOString()
    }, { onConflict: 'id' });
    if (error) console.error(`Error syncing review ${rev.id}:`, error.message);
    else console.log(`✓ Review synced: ${rev.id} (${rev.rating} stars)`);
  }

  // --- VERIFY FINAL ROW COUNTS ---
  console.log('\n5. Verifying Final Supabase Table Counts:');
  const tables = ['orders', 'customers', 'returns', 'reviews', 'users'];
  for (const t of tables) {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
    if (error) console.error(`Table ${t} count error:`, error.message);
    else console.log(`→ Table '${t}': ${count} rows confirmed in Supabase.`);
  }

  console.log('\n🎉 ALL TABLES SEEDED AND SUPABASE UPDATED SUCCESSFULLY!');
}

seedSupabase();
