import { useState, useEffect } from 'react';
import formatGuess from './helpers/formatGuess';
import addNewGuess from './helpers/addNewGuess';
import handleKeyup from './helpers/handleKeyup';

const useWordle = (solution, { onInvalidWord, initialState = {} } = {}) => {
  const [turn, setTurn] = useState(initialState.turn || 0);
  const [currentGuess, setCurrentGuess] = useState(
    initialState.currentGuess || '',
  );
  const [guesses, setGuesses] = useState(initialState.guesses || [...Array(6)]);
  const [validWords, setValidWords] = useState(new Set());
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState(initialState.usedKeys || {});
  const [hardMode, setHardMode] = useState(() => {
    return localStorage.getItem('difficulty') === 'hard';
  });

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
    validWords,
    usedKeys,
    setCurrentGuess,
    setGuesses,
    setTurn,
    setIsCorrect,
    setUsedKeys,
    addNewGuess,
    formatGuess,
    hardMode,
    setHardMode,
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
        setUsedKeys,
        solution,
        addNewGuess,
        formatGuess,
        onInvalidWord,
        hardMode,
        guesses,
      }),
  };
};

export default useWordle;
