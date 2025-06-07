import { useState, useEffect } from 'react';
import formatGuess from './helpers/formatGuess';
import addNewGuess from './helpers/addNewGuess';
import handleKeyup from './helpers/handleKeyup';

const useWordle = (solution, { onInvalidWord } = {}) => {
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([...Array(6)]);
  const [validWords, setValidWords] = useState(new Set());
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState({});

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
      }),
  };
};

export default useWordle;
