import React from 'react';
import PropTypes from 'prop-types';

export default function Tile({
  letter,
  bgColor,
  borderColor,
  flipDelay = 0,
  shouldPop = false,
}) {
  const shouldFlip = !!bgColor;

  const style = {
    '--background': bgColor || '#121213',
    '--border-color': borderColor || '#3A3A3C',
    backgroundColor: shouldFlip ? '#121213' : bgColor || 'transparent',
    borderColor: shouldFlip ? '#3A3A3C' : borderColor || '#3A3A3C',
    color: 'white',
    animationDelay: `${flipDelay}s`,
  };

  return (
    <div
      data-testid="tile"
      className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-2xl sm:text-3xl font-bold uppercase mx-0.5 border-2 ${
        shouldFlip ? 'flip' : ''
      } ${shouldPop ? 'pop' : ''}`}
      style={style}
    >
      {letter}
    </div>
  );
}

Tile.propTypes = {
  letter: PropTypes.string,
  bgColor: PropTypes.string,
  borderColor: PropTypes.string,
  flipDelay: PropTypes.number,
  shouldPop: PropTypes.bool,
};

Tile.defaultProps = {
  letter: '',
  bgColor: null,
  borderColor: null,
  flipDelay: 0,
  shouldPop: false,
};
