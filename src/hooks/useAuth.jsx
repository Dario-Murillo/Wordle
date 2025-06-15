'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import createClient from '../utils/supabase/client';

export default function useAuth(redirectIfNoUser = true) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        if (redirectIfNoUser) {
          router.replace('/login');
        }
        setUser(null);
      } else {
        setUser(data.user);
      }
    });
  }, [router, redirectIfNoUser]);

  return user;
}
