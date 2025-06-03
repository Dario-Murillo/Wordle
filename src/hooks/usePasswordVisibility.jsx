import { useState } from 'react';

export default function usePasswordVisibility(initial = false) {
  const [isVisible, setIsVisible] = useState(initial);
  const toggleVisibility = () => setIsVisible((prev) => !prev);
  return [isVisible, toggleVisibility];
}
