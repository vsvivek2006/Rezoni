import crypto from 'crypto';

export interface AdminSession {
  adminId: string;
  role: string;
  issuedAt: number;
  expiresAt: number;
}

/**
 * Timing-safe credential comparison to prevent timing attacks
 * Strictly ingests credentials from environment variables without hardcoded fallbacks
 */
export function verifyAdminCredentials(inputId: string, inputPassword: string): boolean {
  const adminId = process.env.ADMIN_ID?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  // If server environment credentials are not configured, deny access immediately
  if (!adminId || !adminPassword || !inputId || !inputPassword) {
    return false;
  }

  const cleanInputId = inputId.trim().toLowerCase();
  const cleanTargetId = adminId.toLowerCase();

  // Also accept 'admin' as an alias if ADMIN_ID is an email
  const isIdValid = cleanInputId === cleanTargetId || cleanInputId === 'admin';
  if (!isIdValid) return false;

  const providedPassword = inputPassword.trim();

  // Constant-time buffer comparison if lengths match
  const bufTarget = Buffer.from(adminPassword);
  const bufProvided = Buffer.from(providedPassword);

  if (bufTarget.length !== bufProvided.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufTarget, bufProvided);
}

/**
 * Generate a cryptographically signed HMAC session token
 */
export function createSessionToken(adminId: string): string {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!sessionSecret) {
    throw new Error('ADMIN_SESSION_SECRET environment variable is missing');
  }

  const payload: AdminSession = {
    adminId,
    role: 'Executive Store Administrator',
    issuedAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  const json = JSON.stringify(payload);
  const base64Payload = Buffer.from(json).toString('base64url');
  const signature = crypto
    .createHmac('sha256', sessionSecret)
    .update(base64Payload)
    .digest('base64url');

  return `${base64Payload}.${signature}`;
}

/**
 * Verify HMAC signature and validate expiration
 */
export function verifySessionToken(token: string): AdminSession | null {
  try {
    const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim();
    if (!sessionSecret || !token || !token.includes('.')) return null;

    const [base64Payload, signature] = token.split('.');
    const expectedSignature = crypto
      .createHmac('sha256', sessionSecret)
      .update(base64Payload)
      .digest('base64url');

    if (
      Buffer.from(signature).length !== Buffer.from(expectedSignature).length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      return null;
    }

    const json = Buffer.from(base64Payload, 'base64url').toString('utf8');
    const session: AdminSession = JSON.parse(json);

    if (Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch (e) {
    return null;
  }
}

/**
 * Extract and verify admin session from NextRequest (Cookie or Authorization Bearer)
 */
export function getAdminSessionFromRequest(req: { cookies: { get: (name: string) => { value: string } | undefined }; headers: { get: (name: string) => string | null } }): AdminSession | null {
  const cookieToken = req.cookies.get('rezoni_admin_session')?.value;
  const authHeader = req.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  const token = cookieToken || bearerToken;
  if (!token) return null;

  return verifySessionToken(token);
}

