'use client';

import { useState, useCallback } from 'react';

export default function useModalVisibility(
  cleanError,
  initial = false,
  animationDuration = 300,
) {
  const [isVisible, setIsVisible] = useState(initial);
  const [shouldRender, setShouldRender] = useState(initial);

  const openModal = useCallback(() => {
    setShouldRender(true);
    setTimeout(() => setIsVisible(true), 10); // pequeño delay para animación de entrada
  }, [cleanError]);

  const closeModal = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setShouldRender(false), animationDuration); // espera la animación de salida
  }, [cleanError, animationDuration]);

  return [isVisible, shouldRender, openModal, closeModal];
}
