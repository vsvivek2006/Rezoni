import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  // Check cookie or Authorization Bearer header
  const cookieToken = req.cookies.get('rezoni_admin_session')?.value;
  const authHeader = req.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  const token = cookieToken || bearerToken;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    admin: {
      id: session.adminId,
      role: session.role,
      expiresAt: session.expiresAt,
    },
  });
}
