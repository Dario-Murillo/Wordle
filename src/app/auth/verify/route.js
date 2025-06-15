/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */

// app/auth/verify/route.ts
import { NextResponse } from 'next/server';
import createClient from '../../../utils/supabase/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  const supabase = await createClient();

  if (!token_hash || type !== 'recovery') {
    return NextResponse.redirect(new URL('/error', request.url));
  }

  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type,
  });

  if (error) {
    console.error('OTP error:', error.message);
    return NextResponse.redirect(new URL('/error', request.url));
  }

  const response = NextResponse.redirect(
    new URL('/recovery/reset', request.url),
  );

  response.cookies.set('allow_password_reset', 'true', {
    maxAge: 60 * 5,
    path: '/recovery/reset',
    httpOnly: false,
    sameSite: 'lax',
  });

  return response;
}
