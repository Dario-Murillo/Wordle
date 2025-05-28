import React from 'react';
import PropTypes from 'prop-types';
import Row from './Row';

export default function Grid({ guesses, currentGuess, turn }) {
  return (
    <div>
      {guesses.map((g, i) => {
        if (turn === i) {
          return <Row key={i} currentGuess={currentGuess} />;
        }
        return <Row key={i} guess={g} />;
      })}
    </div>
  );
}

Grid.propTypes = {
  guesses: PropTypes.array.isRequired,
  currentGuess: PropTypes.string.isRequired,
  turn: PropTypes.number.isRequired,
};
