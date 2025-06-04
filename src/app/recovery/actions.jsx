'use server';

import createClient from '../../utils/supabase/server';

function validateEmail(email) {
  if (typeof email !== 'string' || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function recoveryActions(prevState, formData) {
  const supabase = await createClient();

  const email = formData.get('email')?.toString();

  if (!email) {
    return { error: 'Llena los campos obligatorios' };
  }

  if (!validateEmail(email)) {
    return { error: 'Correo electrónico inválido' };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { error: 'Error al enviar el correo' };
  }

  return { success: true };
}
