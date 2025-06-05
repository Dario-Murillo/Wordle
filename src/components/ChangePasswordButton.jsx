'use client';

import { useRouter } from 'next/navigation';
import createClient from '../utils/supabase/client';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error.message);
    } else {
      router.replace('/login');
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="bg-white text-black px-4 py-2 rounded-3xl cursor-pointer"
    >
      Cambiar Contraseña
    </button>
  );
}
