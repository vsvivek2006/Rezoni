import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, getOrderByIdOrQuery, createNewOrder } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || searchParams.get('id') || searchParams.get('trackingNumber');

    if (query) {
      const order = getOrderByIdOrQuery(query);
      if (!order) {
        return NextResponse.json(
          { success: false, message: `No shipment found for "${query}". Please check the Order ID or phone number.` },
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

    return NextResponse.json({
      success: true,
      message: 'Order placed and confirmed successfully!',
      order,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
