'use client';

import { useEffect, useState } from 'react';

export default function Game() {
  const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (isDifficultyModalOpen) {
      setTimeout(() => {
        setModalVisible(true);
      }, 10);
    }
  }, [isDifficultyModalOpen]);

  const handleDifficultySelect = (difficulty) => {
    setModalVisible(false);
    setTimeout(() => {
      setIsDifficultyModalOpen(false);
    }, 500);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-[#121213]">
      {isDifficultyModalOpen && (
        <div className="fixed inset-0 bg-[#121213] flex items-center justify-center z-50">
          <div
            className={`bg-[#1E1E1E] px-8 py-8 rounded-lg shadow-lg max-w-md w-full text-center min-h-[280px] flex flex-col items-center justify-center transform transition-all duration-500 ease-in-out
          ${modalVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
          `}
          >
            <h1 className="text-4xl font-bold font-[family-name:var(--font-alfaslabone)] mb-8 tracking-wide leading-tight text-white text-center">
              Selecciona la Dificultad
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
              <button
                onClick={() => handleDifficultySelect('normal')}
                className="rounded-full font-bold font-[family-name:var(--font-karla)] text-black bg-[#D9D9D9] text-lg h-12 w-36 px-6"
              >
                Normal
              </button>
              <button
                onClick={() => handleDifficultySelect('hard')}
                className="rounded-full font-bold font-[family-name:var(--font-karla)] text-black bg-[#D9D9D9] text-lg h-12 w-36 px-6"
              >
                Difícil
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center"></main>
    </div>
  );
}
