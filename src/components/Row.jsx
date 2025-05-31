import React from 'react';
import PropTypes from 'prop-types';
import Tile from './Tile';

export default function Row({ guess, currentGuess }) {
  if (Array.isArray(guess)) {
    const colorMap = {
      green: '#538D4E',
      yellow: '#B59F3B',
      gray: '#3A3A3C',
    };

    return (
      <div data-testid="row" className="flex justify-center gap-1 mb-2">
        {guess.map((l, i) => (
          <Tile
            /* eslint-disable-next-line react/no-array-index-key */
            key={`${l.key}-${i}`}
            letter={l.key}
            bgColor={colorMap[l.color]}
            borderColor={colorMap[l.color]}
          />
        ))}
      </div>
    );
  }

  if (currentGuess) {
    const letters = currentGuess.split('');
    return (
      <div data-testid="row" className="flex justify-center gap-1 mb-2">
        {letters.map((letter, i) => (
          <Tile
            /* eslint-disable-next-line react/no-array-index-key */
            key={`letter-${letter}-${i}`}
            letter={letter}
            borderColor="#565758"
          />
        ))}
        {[...Array(5 - letters.length)].map((_, i) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <Tile key={`empty-${_}-${i}`} />
        ))}
      </div>
    );
  }

  return (
    <div data-testid="row" className="flex justify-center gap-1 mb-2">
      {[...Array(5)].map((_, i) => (
        /* eslint-disable-next-line react/no-array-index-key */
        <Tile key={`${_}-${i}`} />
      ))}
    </div>
  );
}

Row.propTypes = {
  guess: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
      }),
    ),
    PropTypes.oneOf([null]),
  ]),
  currentGuess: PropTypes.string.isRequired,
};

Row.defaultProps = {
  guess: null,
};
