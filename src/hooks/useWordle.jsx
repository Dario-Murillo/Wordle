import { useState } from 'react';

const useWordle = (solution) => {
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([...Array(6)]);

  const formatGuess = () => {
    let formattedGuess = [...currentGuess].map((letter) => {
      return { key: letter, color: 'gray' };
    });

    return formattedGuess;
  };

  const addNewGuess = (formattedGuess) => {
    setGuesses((prevGuesses) => {
      let newGuesses = [...prevGuesses];
      newGuesses[turn] = formattedGuess;
      return newGuesses;
    });

    setTurn((prevTurn) => {
      return prevTurn + 1;
    });

    setCurrentGuess('');
  };

  const handleKeyup = ({ key }) => {
    if (key === 'Enter') {
      if (turn > 5) {
        return;
      }
      if (currentGuess.length !== 5) {
        return;
      }
      const formatted = formatGuess();
      addNewGuess(formatted);
    }
    if (key === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }
    if (/^[A-Za-z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key);
      }
    }
  };

  return { turn, currentGuess, guesses, handleKeyup };
};

export default useWordle;
