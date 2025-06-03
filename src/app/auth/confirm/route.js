/* eslint-disable import/prefer-default-export */ // routes need to export a function named GET
/* eslint-disable camelcase */ // token_has is a snake_case variable
import { redirect } from 'next/navigation';
import createClient from '../../../utils/supabase/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/';

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next);
    }
    console.error('Error confirming email:', error.message);
  }

  // redirect the user to an error page with some instructions
  redirect('/error');
}
