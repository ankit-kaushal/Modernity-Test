import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    // Get the secret from environment variables
    const secret = process.env.TOTP_SECRET;

    if (!secret) {
      return NextResponse.json(
        { error: 'TOTP secret not configured' },
        { status: 500 }
      );
    }

    // Verify the TOTP code (allow 1 step window for clock drift)
    // Configure authenticator with window option
    authenticator.options = {
      window: [1, 1], // Allow 1 step before and after current time
    };
    const isValid = authenticator.check(code, secret);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 401 }
      );
    }

    // Create a session token (simple approach - in production, use proper session management)
    const sessionToken = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');

    // Set a cookie for the session (valid for 24 hours)
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error verifying TOTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    );
  }
}

