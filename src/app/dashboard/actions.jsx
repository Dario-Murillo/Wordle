'use server';

import createClient from '../../utils/supabase/server';

function validatePassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
}

export default async function changePassword(prevState, formData) {
  const supabase = await createClient();

  const password = formData.get('password')?.toString();
  const confirmation = formData.get('confirmation')?.toString();

  if (!password || !confirmation) {
    return { error: 'Llena los campos obligatorios' };
  }

  if (!validatePassword(password)) {
    return {
      error:
        'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
    };
  }

  if (password !== confirmation) {
    return { error: 'Las contraseñas no coinciden' };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return {
      error: 'Error al restablecer la contraseña. Intentalo de nuevo',
    };
  }

  return { success: true };
}
