import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayInstance, getRazorpayKeys } from '@/lib/razorpayServer';
import { validateAndCalculateCart } from '@/lib/priceCalculator';
import { generateOrderId, saveOrder, OrderRecord } from '@/lib/orderStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer } = body;

    // Validate customer address & contact details
    if (
      !customer ||
      !customer.email ||
      !customer.phone ||
      !customer.fullName ||
      !customer.pincode ||
      !customer.addressLine1 ||
      !customer.city ||
      !customer.state
    ) {
      return NextResponse.json(
        { success: false, message: 'Incomplete shipping or contact details provided.' },
        { status: 400 }
      );
    }

    // Server-side price calculation & verification
    const cartCalculation = validateAndCalculateCart(items);
    if (!cartCalculation.isValid) {
      return NextResponse.json(
        { success: false, message: cartCalculation.error || 'Invalid cart contents.' },
        { status: 400 }
      );
    }

    // Check credentials
    const { keyId, isConfigured } = getRazorpayKeys();
    if (!isConfigured) {
      return NextResponse.json(
        {
          success: false,
          isConfigError: true,
          message:
            'Razorpay API Keys are not configured. Please add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local.',
        },
        { status: 500 }
      );
    }

    const razorpay = getRazorpayInstance();
    const orderId = generateOrderId();
    const receipt = `rcpt_${orderId.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now().toString().slice(-4)}`.slice(0, 40);

    // Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: cartCalculation.totalPaise,
      currency: 'INR',
      receipt: receipt,
      notes: {
        rezoni_order_id: orderId,
        customer_name: customer.fullName.slice(0, 40),
        customer_email: customer.email.slice(0, 40),
        customer_phone: customer.phone.slice(0, 15),
      },
    });

    // Store record in order store as created (pending payment)
    const initialOrder: OrderRecord = {
      orderId,
      receipt,
      razorpayOrderId: razorpayOrder.id,
      amount: cartCalculation.totalAmount,
      currency: 'INR',
      status: 'created',
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        addressLine1: customer.addressLine1.trim(),
        addressLine2: customer.addressLine2 ? customer.addressLine2.trim() : undefined,
        city: customer.city.trim(),
        state: customer.state.trim(),
        pincode: customer.pincode.trim(),
      },
      items: cartCalculation.items,
      createdAt: new Date().toISOString(),
    };

    saveOrder(initialOrder);

    return NextResponse.json({
      success: true,
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount, // in paise
      currency: razorpayOrder.currency,
      keyId,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to initiate checkout order with Razorpay.',
      },
      { status: 500 }
    );
  }
}
