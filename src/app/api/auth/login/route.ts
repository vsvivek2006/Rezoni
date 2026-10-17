import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No account found with this email. Please register first.' },
        { status: 404 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Logged in successfully!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        orders: user.orders,
        reviews: user.reviews,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
