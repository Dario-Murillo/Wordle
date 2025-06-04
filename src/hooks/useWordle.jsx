import { useState, useEffect } from 'react';
import { formatGuess, addNewGuess, handleKeyup } from './useWordleHelpers';

const useWordle = (solution) => {
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([...Array(6)]);
  const [validWords, setValidWords] = useState(new Set());
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const loadWords = async () => {
      const res = await fetch('/validWords.txt');
      const text = await res.text();
      const words = text
        .split('\n')
        .map((w) => w.trim().toLowerCase())
        .filter(Boolean);
      setValidWords(new Set(words));
    };

    loadWords();
  }, []);

  return {
    turn,
    currentGuess,
    guesses,
    isCorrect,
    handleKeyup: (event) =>
      handleKeyup({
        key: event.key,
        currentGuess,
        turn,
        validWords,
        setCurrentGuess,
        setGuesses,
        setIsCorrect,
        setTurn,
        solution,
        addNewGuess,
        formatGuess,
      }),
  };
};

export default useWordle;
