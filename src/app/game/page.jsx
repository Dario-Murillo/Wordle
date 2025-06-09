'use client';

import { useEffect, useState } from 'react';
import Wordle from '../../components/Wordle';

export default function Game() {
  const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [secretWord, setSecretWord] = useState('');

  useEffect(() => {
    const savedWord = localStorage.getItem('secretWord');
    const savedDifficulty = localStorage.getItem('difficulty');

    if (savedWord && savedDifficulty) {
      setSecretWord(savedWord);
      setIsDifficultyModalOpen(false);
    } else {
      // No game in progress
      setTimeout(() => setModalVisible(true), 10);
    }
  }, []);

  const fetchRandomWord = async () => {
    try {
      const res = await fetch('/solutionWords.txt');
      const text = await res.text();
      const words = text
        .split('\n')
        .map((w) => w.trim())
        .filter(Boolean);
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setSecretWord(randomWord);
      localStorage.setItem('secretWord', randomWord.toLowerCase());
    } catch (error) {
      console.error('Failed to load words:', error);
    }
  };

  const handleDifficultySelect = (difficulty) => {
    setModalVisible(false);
    setTimeout(() => {
      setIsDifficultyModalOpen(false);
      localStorage.setItem('difficulty', difficulty);
      fetchRandomWord();
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#121213] p-4 sm:p-6">
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
                type="button"
                onClick={() => handleDifficultySelect('normal')}
                className="cursor-pointer rounded-full font-bold font-[family-name:var(--font-karla)] text-black bg-[#D9D9D9] text-lg h-12 w-36 px-6"
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => handleDifficultySelect('hard')}
                className="cursor-pointer rounded-full font-bold font-[family-name:var(--font-karla)] text-black bg-[#D9D9D9] text-lg h-12 w-36 px-6"
              >
                Difícil
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="w-full max-w-xl">
        {secretWord && <Wordle secretWord={secretWord} />}
      </main>
    </div>
  );
}
