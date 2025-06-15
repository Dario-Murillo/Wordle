'use server';

import createClient from '../../utils/supabase/server';

function validatePassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
}

export default async function changePassword(prevState, formData) {
  const supabase = await createClient();

  const oldPassword = formData.get('old-password')?.toString();
  const password = formData.get('new-password')?.toString();
  const confirmation = formData.get('confirmation-password')?.toString();

  if (!oldPassword || !password || !confirmation) {
    return { error: 'Llena los campos obligatorios' };
  }

  if (!validatePassword(password)) {
    return {
      error:
        'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
    };
  }

  if (password !== confirmation) {
    return {
      error: 'Las contraseñas no coinciden',
    };
  }

  // Obtener el usuario actual
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Reautenticar usando el email y la contraseña antigua
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: oldPassword,
  });

  if (signInError) {
    return {
      error: 'La contraseña actual es incorrecta',
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return {
      error: 'Error al restablecer la contraseña. Intentalo de nuevo',
      field: 'new-password',
    };
  }

  return { success: true };
}
