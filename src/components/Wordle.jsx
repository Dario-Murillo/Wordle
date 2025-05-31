import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useWordle from '../hooks/useWordle';
import Grid from './Grid';

export default function Wordle({ secretWord }) {
  const { currentGuess, guesses, turn, handleKeyup } = useWordle(secretWord);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyup);

    return () => window.removeEventListener('keyup', handleKeyup);
  }, [handleKeyup]);

  useEffect(() => {}, [guesses, turn]);

  return (
    <div>
      <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} />
    </div>
  );
}

Wordle.propTypes = {
  secretWord: PropTypes.string.isRequired,
};
