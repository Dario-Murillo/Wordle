'use server';

import createClient from '../../utils/supabase/server';

export default async function loginAction(prevState, formData) {
  const supabase = await createClient();

  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Llena los campos obligatorios' };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'Error al iniciar' };
  }

  return { success: true };
}
