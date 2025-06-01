'use server';

import { redirect } from 'next/navigation';
import createClient from '../../utils/supabase/server';

export default async function loginAction(formData) {
  const supabase = await createClient();

  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    redirect('/login?error=Faltan datos');
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect('/login?error=Credenciales invalidas');
  }

  redirect('/dashboard');
}
