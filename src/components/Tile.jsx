import React from 'react';
import PropTypes from 'prop-types';

export default function Tile({
  letter,
  bgColor,
  borderColor,
  flipDelay = 0,
  shouldPop = false,
  shouldJump = false,
  jumpDelay = 0,
}) {
  const shouldFlip = !!bgColor;

  const style = {
    '--background': bgColor || '#121213',
    '--border-color': borderColor || '#3A3A3C',
    backgroundColor: shouldFlip ? '#121213' : bgColor || 'transparent',
    borderColor: shouldFlip ? '#3A3A3C' : borderColor || '#3A3A3C',
    color: 'white',
  };

  if (shouldFlip && shouldJump) {
    style.animation = `flip 0.6s ease-in-out forwards ${flipDelay}s, jump 0.4s ease ${flipDelay + jumpDelay}s`;
  } else if (shouldFlip) {
    style.animation = `flip 0.6s ease-in-out forwards ${flipDelay}s`;
  }

  return (
    <div
      data-testid="tile"
      className={`w-[48px] h-[48px] sm:w-[62px] sm:h-[62px] flex items-center justify-center text-2xl sm:text-3xl font-bold uppercase border-2 
        ${shouldFlip ? 'flip' : ''} 
        ${shouldPop ? 'pop' : ''} 
       ${shouldJump ? 'jump' : ''}
      `}
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
  shouldJump: PropTypes.bool,
  jumpDelay: PropTypes.number,
};

Tile.defaultProps = {
  letter: '',
  bgColor: null,
  borderColor: null,
  flipDelay: 0,
  shouldPop: false,
  shouldJump: false,
  jumpDelay: 0,
};
