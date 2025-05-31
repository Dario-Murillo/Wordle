import React from 'react';
import PropTypes from 'prop-types';

export default function Tile({ letter, bgColor, borderColor }) {
  const style = {
    backgroundColor: bgColor || 'transparent',
    border: `2px solid ${borderColor || '#3A3A3C'}`,
  };

  return (
    <div
      data-testid="tile"
      className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-2xl sm:text-3xl font-bold uppercase mx-0.5 text-white"
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
};

Tile.defaultProps = {
  letter: '',
  bgColor: null,
  borderColor: null,
};
