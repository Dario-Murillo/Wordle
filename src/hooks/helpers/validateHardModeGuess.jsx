// Validates that the current guess respects hard mode rules
export default function validateHardModeGuess(previousGuesses, currentGuess) {
  if (!previousGuesses) return null;

  const lastGuess = previousGuesses
    .slice()
    .reverse()
    .find((g) => Array.isArray(g)); // get most recent completed guess

  if (!lastGuess) return null;

  for (let i = 0; i < lastGuess.length; i += 1) {
    const { key, color } = lastGuess[i];
    const char = currentGuess[i];

    if (color === 'green' && char !== key) {
      return `La letra ${key.toUpperCase()} debe estar en la posición ${i + 1}.`;
    }

    if (color === 'yellow' && !currentGuess.includes(key)) {
      return `Debes usar la letra ${key.toUpperCase()}.`;
    }
  }

  return null;
}
