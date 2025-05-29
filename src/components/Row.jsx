import React from 'react';
import PropTypes from 'prop-types';

export default function Row({ guess, currentGuess }) {
  if (Array.isArray(guess)) {
    return (
      <div data-testid="row" className="flex justify-center gap-1 mb-2">
        {guess.map((l, i) => {
          let bgColor = '#3A3A3C';
          return (
            <div
              key={i}
              data-testid="tile"
              className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-2xl sm:text-3xl font-bold uppercase mx-0.5 text-white border-none"
              style={{ backgroundColor: bgColor }}
            >
              {l.key}
            </div>
          );
        })}
      </div>
    );
  }

  if (currentGuess) {
    const letters = currentGuess.split('');
    return (
      <div data-testid="row" className="flex justify-center gap-1 mb-2">
        {letters.map((letter, i) => (
          <div
            key={`letter-${i}`}
            data-testid="tile"
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-2xl sm:text-3xl font-bold uppercase mx-0.5 text-white border-2 border-[#565758]"
          >
            {letter}
          </div>
        ))}
        {[...Array(5 - letters.length)].map((_, i) => (
          <div
            key={`empty-${i}`}
            data-testid="tile"
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-2xl sm:text-3xl font-bold uppercase mx-0.5 border-2 border-[#3A3A3C]"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div data-testid="row" className="flex justify-center gap-1 mb-2">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          data-testid="tile"
          className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-2xl sm:text-3xl font-bold uppercase mx-0.5 border-2 border-[#3A3A3C]"
        ></div>
      ))}
    </div>
  );
}

Row.propTypes = {
  guess: PropTypes.array.isRequired,
  currentGuess: PropTypes.string.isRequired,
};
