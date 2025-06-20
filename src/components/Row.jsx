import React from 'react';
import PropTypes from 'prop-types';
import Tile from './Tile';

export default function Row({
  guess,
  currentGuess,
  isWinningRow,
  shouldShake,
}) {
  if (Array.isArray(guess)) {
    const colorMap = {
      green: '#538D4E',
      yellow: '#B59F3B',
      gray: '#3A3A3C',
    };

    return (
      <div data-testid="row" className="flex justify-center gap-[5px] mb-[5px]">
        {guess.map((l, i) => (
          <Tile
            /* eslint-disable-next-line react/no-array-index-key */
            key={`${l.key}-${i}`}
            letter={l.key}
            bgColor={colorMap[l.color]}
            borderColor={colorMap[l.color]}
            flipDelay={i * 0.2}
            shouldJump={isWinningRow}
            jumpDelay={0.8 + 0.6}
          />
        ))}
      </div>
    );
  }

  if (currentGuess) {
    const letters = currentGuess.split('');
    return (
      <div
        data-testid="row"
        className={`flex justify-center gap-[5px] mb-[5px] ${shouldShake ? 'shake' : ''}`}
      >
        {letters.map((letter, i) => (
          <Tile
            /* eslint-disable-next-line react/no-array-index-key */
            key={`letter-${letter}-${i}`}
            letter={letter}
            borderColor="#565758"
            shouldPop={!!letter}
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
    <div data-testid="row" className="flex justify-center gap-[5px] mb-[5px]">
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
  isWinningRow: PropTypes.bool.isRequired,
  shouldShake: PropTypes.bool,
};

Row.defaultProps = {
  guess: null,
  shouldShake: false,
};
