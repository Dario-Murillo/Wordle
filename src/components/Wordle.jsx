import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useWordle from '../hooks/useWordle';
import Grid from './Grid';
import EndModal from './EndModal';

export default function Wordle({ secretWord }) {
  const { currentGuess, guesses, turn, isCorrect, handleKeyup } =
    useWordle(secretWord);
  const [showEndModal, setShowEndModal] = useState(false);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyup);

    if (isCorrect) {
      console.log('congrats, you win');
      setTimeout(() => setShowEndModal(true), 2000);
      window.removeEventListener('keyup', handleKeyup);
    }
    if (turn > 5) {
      console.log('unlucky, out of guesses');
      window.removeEventListener('keyup', handleKeyup);
    }

    return () => window.removeEventListener('keyup', handleKeyup);
  }, [handleKeyup, isCorrect, turn]);

  return (
    <div>
      <div className="relative z-0">
        <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} />
      </div>
      <EndModal
        isCorrect={isCorrect}
        turn={turn}
        solution={secretWord}
        modalVisible={showEndModal}
      />
    </div>
  );
}

Wordle.propTypes = {
  secretWord: PropTypes.string.isRequired,
};
