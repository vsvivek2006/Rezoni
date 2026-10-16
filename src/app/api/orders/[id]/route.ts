import { NextRequest, NextResponse } from 'next/server';
import { getOrderByIdAsync } from '@/lib/orderStore';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 });
    }

    const order = await getOrderByIdAsync(id);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Mask sensitive details if needed, but return full receipt for the confirmed customer
    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
