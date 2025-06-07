// Helper function to format a guess
export default function formatGuess(solution, currentGuess) {
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
}
