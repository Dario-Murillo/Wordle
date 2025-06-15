import React from 'react';
import PropTypes from 'prop-types';
import Row from './Row';

export default function Grid({
  guesses,
  currentGuess,
  turn,
  isCorrect,
  shouldShake,
}) {
  return (
    <div className="w-full max-w-[340px] sm:max-w-[400px] mx-auto">
      {guesses.map((g, i) => {
        const isWinningRow = isCorrect && i === turn - 1;
        if (turn === i) {
          return (
            <Row
              /* eslint-disable-next-line react/no-array-index-key */
              key={`${g}-${i}`}
              currentGuess={currentGuess}
              shouldShake={shouldShake && i === turn}
            />
          );
        }
        /* eslint-disable-next-line react/no-array-index-key */
        return <Row key={`${g}-${i}`} guess={g} isWinningRow={isWinningRow} />;
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
  isCorrect: PropTypes.bool.isRequired,
  shouldShake: PropTypes.bool.isRequired,
};
