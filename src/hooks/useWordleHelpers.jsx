// Helper function to format a guess
export const formatGuess = (solution, currentGuess) => {
  const solutionArray = [...solution];
  const formattedGuess = [...currentGuess].map((letter) => {
    return { key: letter, color: 'gray' };
  });

  // find any green letters
  formattedGuess.forEach((letter, i) => {
    if (solution[i] === letter.key) {
      formattedGuess[i].color = 'green';
      solutionArray[i] = null;
    }
  });

  // find any yellow letters
  formattedGuess.forEach((letter, i) => {
    if (solutionArray.includes(letter.key) && letter.color !== 'green') {
      formattedGuess[i].color = 'yellow';
      solutionArray[solutionArray.indexOf(letter.key)] = null;
    }
  });

  return formattedGuess;
};

// Helper function to add a new guess
export const addNewGuess = ({
  turn,
  formattedGuess,
  currentGuess,
  solution,
  setGuesses,
  setTurn,
  setCurrentGuess,
  setIsCorrect,
  setUsedKeys,
}) => {
  if (currentGuess === solution) {
    setIsCorrect(true);
  }
  setGuesses((prevGuesses) => {
    const newGuesses = [...prevGuesses];
    newGuesses[turn] = formattedGuess;
    return newGuesses;
  });

  setTimeout(() => {
    setUsedKeys((prev) => {
      const newKeys = { ...prev };
      formattedGuess.forEach(({ key, color }) => {
        const currentColor = newKeys[key];
        if (
          color === 'green' ||
          (color === 'yellow' && currentColor !== 'green') ||
          (color === 'gray' && !currentColor)
        ) {
          newKeys[key] = color;
        }
      });
      return newKeys;
    });
  }, 1500);

  setTurn((prevTurn) => prevTurn + 1);
  setCurrentGuess('');
};

// Helper function to handle the keyup event
export const handleKeyup = ({
  key,
  currentGuess,
  turn,
  validWords,
  setCurrentGuess,
  setGuesses,
  setIsCorrect,
  setTurn,
  setUsedKeys,
  solution,
  formatGuess: injectedFormatGuess = formatGuess,
  addNewGuess: injectedAddNewGuess = addNewGuess,
  onInvalidWord,
}) => {
  if (key === 'Enter') {
    if (turn > 5 || currentGuess.length !== 5) {
      return;
    }
    if (!validWords.has(currentGuess.toLowerCase())) {
      onInvalidWord?.();
      return;
    }
    const formattedGuess = injectedFormatGuess(solution, currentGuess);
    injectedAddNewGuess({
      turn,
      formattedGuess,
      currentGuess,
      solution,
      setGuesses,
      setTurn,
      setCurrentGuess,
      setIsCorrect,
      setUsedKeys,
    });
  }

  if (key === 'Backspace') {
    setCurrentGuess((prev) => prev.slice(0, -1));
    return;
  }

  if (/^[A-Za-z]$/.test(key)) {
    if (currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key.toLowerCase());
    }
  }
};
