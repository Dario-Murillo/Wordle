'use client';

import { useState, useCallback } from 'react';

export default function useToast() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  const triggerToast = useCallback((msg) => {
    setMessage(msg);
    setShow(true);
  }, []);

  const closeToast = useCallback(() => setShow(false), []);

  return { show, message, triggerToast, closeToast };
}
