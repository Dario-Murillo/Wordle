import React from 'react';
import PropTypes from 'prop-types';

const keyLayout = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
];

export default function Keyboard({ onKeyPress, usedKeys = {} }) {
  const colorClass = {
    green: '#538D4E',
    yellow: '#B59F3B',
    gray: '#3A3A3C',
  };

  return (
    <div className="mt-6 space-y-2 w-full max-w-lg mx-auto px-1 sm:px-4">
      {keyLayout.map((row, rowIndex) => {
        const isMiddleRow = rowIndex === 1;

        return (
          <div key={row} className="flex justify-center gap-1">
            {isMiddleRow && (
              <span className="invisible basis-[40px] sm:basis-[43px]" />
            )}

            {row.map((key) => {
              const isSpecial = key === 'Enter' || key === 'Backspace';
              const keyColor =
                colorClass[usedKeys[key?.toLowerCase()]] || '#818384';
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => onKeyPress(key)}
                  className={`cursor-pointer keyboard-key text-white font-bold py-2 sm:py-3 px-2 sm:px-4 rounded uppercase hover:brightness-110 active:scale-95 transition duration-100
                    ${isSpecial ? 'basis-[60px] sm:basis-[70px]' : 'basis-[40px] sm:basis-[43px]'}
                    text-lg sm:text-xl
                  `}
                  style={{ height: '58px', background: keyColor }}
                >
                  {key === 'Backspace' ? '⌫' : key}
                </button>
              );
            })}

            {isMiddleRow && (
              <span className="invisible basis-[40px] sm:basis-[43px]" />
            )}
          </div>
        );
      })}
    </div>
  );
}

Keyboard.propTypes = {
  onKeyPress: PropTypes.func.isRequired,
  usedKeys: PropTypes.objectOf(PropTypes.oneOf(['gray', 'yellow', 'green']))
    .isRequired,
};
