// Helper function to add a new guess
export default function addNewGuess({
  turn,
  formattedGuess,
  currentGuess,
  solution,
  setGuesses,
  setTurn,
  setCurrentGuess,
  setIsCorrect,
  setUsedKeys,
}) {
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
}
