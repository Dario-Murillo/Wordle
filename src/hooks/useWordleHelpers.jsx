// Helper function to format a guess
export const formatGuess = (currentGuess) => {
  return [...currentGuess].map((letter) => ({
    key: letter,
    color: 'gray',
  }));
};

// Helper function to add a new guess
export const addNewGuess = (
  turn,
  formattedGuess,
  setGuesses,
  setTurn,
  setCurrentGuess,
) => {
  setGuesses((prevGuesses) => {
    const newGuesses = [...prevGuesses];
    newGuesses[turn] = formattedGuess;
    return newGuesses;
  });

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
  setTurn,
  addNewGuess,
  formatGuess,
}) => {
  if (key === 'Enter') {
    if (turn > 5) {
      return;
    }
    if (currentGuess.length !== 5) {
      return;
    }
    if (!validWords.has(currentGuess.toLowerCase())) {
      alert('Not a valid word!');
      return;
    }
    const formatted = formatGuess(currentGuess);
    addNewGuess(turn, formatted, setGuesses, setTurn, setCurrentGuess);
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
