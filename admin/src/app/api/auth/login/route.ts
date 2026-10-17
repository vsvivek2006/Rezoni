import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, createSessionToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id || body.email || body.username || '';
    const password = body.password || '';

    if (!id || !password) {
      return NextResponse.json(
        { success: false, message: 'Please enter both Admin ID and Password.' },
        { status: 400 }
      );
    }

    const isValid = verifyAdminCredentials(id, password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid Admin ID or Password. Access denied.' },
        { status: 401 }
      );
    }

    const token = createSessionToken(id);

    const response = NextResponse.json({
      success: true,
      token,
      admin: {
        id,
        role: 'Executive Store Administrator',
        host: 'admin.rezoni.shop',
      },
      message: 'Authentication successful. Access granted.',
    });

    // Set secure HTTP-only cookie
    response.cookies.set('rezoni_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Authentication error occurred.' },
      { status: 500 }
    );
  }
}
