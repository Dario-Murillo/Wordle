'use server';

import createClient from '../../utils/supabase/server';

function validateEmail(email) {
  if (typeof email !== 'string' || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
}

export default async function registerAction(prevState, formData) {
  const supabase = await createClient();

  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Llena los campos obligatorios' };
  }

  if (!validateEmail(email)) {
    return { error: 'Correo electrónico inválido' };
  }

  if (!validatePassword(password)) {
    return {
      error:
        'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
    };
  }

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message || 'Error al registrar' };
  }

  return { success: true };
}
