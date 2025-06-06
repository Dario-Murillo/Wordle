'use client';

import { useState } from 'react';

export default function useModalVisibility(initial = false) {
  const [isVisible, setIsVisible] = useState(initial);
  const toggleModal = () => setIsVisible((prev) => !prev);
  return [isVisible, toggleModal];
}
