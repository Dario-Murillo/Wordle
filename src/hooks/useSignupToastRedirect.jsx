import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function useSignupToastRedirect(
  success,
  redirectTo = '/login',
  delay = 5000,
) {
  const [showToast, setShowToast] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (success && showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        router.push(redirectTo);
      }, delay);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [success, showToast, router, redirectTo, delay]);

  return [showToast, setShowToast];
}
