import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 4) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 4 characters.' },
        { status: 400 }
      );
    }

    const existing = findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists. Please log in.' },
        { status: 409 }
      );
    }

    const newUser = createUser(email, password, name);

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully! Welcome to Rezoni.',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          createdAt: newUser.createdAt,
          orders: newUser.orders,
          reviews: newUser.reviews,
        },
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
