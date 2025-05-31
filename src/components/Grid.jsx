import React from 'react';
import PropTypes from 'prop-types';
import Row from './Row';

export default function Grid({ guesses, currentGuess, turn }) {
  return (
    <div>
      {guesses.map((g, i) => {
        if (turn === i) {
          /* eslint-disable-next-line react/no-array-index-key */
          return <Row key={`${g}-${i}`} currentGuess={currentGuess} />;
        }
        /* eslint-disable-next-line react/no-array-index-key */
        return <Row key={`${g}-${i}`} guess={g} />;
      })}
    </div>
  );
}

Grid.propTypes = {
  guesses: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
      }),
    ),
  ).isRequired,
  currentGuess: PropTypes.string.isRequired,
  turn: PropTypes.number.isRequired,
};
