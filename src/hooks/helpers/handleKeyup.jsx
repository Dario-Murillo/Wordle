import formatGuess from './formatGuess';
import addNewGuess from './addNewGuess';

// Helper function to handle the keyup event
export default function handleKeyup({
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
}) {
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
}
