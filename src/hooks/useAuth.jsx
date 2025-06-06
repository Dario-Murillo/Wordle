'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import createClient from '../utils/supabase/client'; // Usa el cliente del lado cliente

export default function useAuth() {
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        router.replace('/login');
      } else {
        setUser(data.user);
      }
    });
  }, [router]);

  return user;
}
