import React from 'react';
import PropTypes from 'prop-types';

export default function EndModal({ isCorrect, solution, modalVisible }) {
  return (
    <div
      className={`
        fixed inset-0 flex items-center justify-center z-50
        transition-all duration-500 ease-in-out
      `}
    >
      <div
        className={`
          bg-[#1E1E1E] px-8 py-8 rounded-lg shadow-lg max-w-md w-full text-center min-h-[280px]
          flex flex-col items-center justify-center transform
          transition-all duration-500 ease-in-out
          ${modalVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
        `}
        style={{ transitionProperty: 'transform, opacity' }}
      >
        {isCorrect ? (
          <div>
            <h1 className="text-4xl font-bold font-[family-name:var(--font-alfaslabone)] mb-8 tracking-wide leading-tight text-white">
              ¡Adivinaste!
            </h1>
            <p className="text-xl text-[#D9D9D9] mb-4 font-[family-name:var(--font-karla)]">
              La palabra era {solution.toUpperCase()}.
            </p>
          </div>
        ) : (
          <div />
        )}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center mt-6">
          <button
            type="button"
            className="rounded-full font-bold font-[family-name:var(--font-karla)] text-black bg-[#D9D9D9] text-lg h-12 w-36 px-6"
          >
            Salir
          </button>
          <button
            type="button"
            className="rounded-full font-bold font-[family-name:var(--font-karla)] text-black bg-[#D9D9D9] text-lg h-12 w-36 px-6"
          >
            Jugar
          </button>
        </div>
      </div>
    </div>
  );
}

EndModal.propTypes = {
  isCorrect: PropTypes.bool.isRequired,
  solution: PropTypes.string.isRequired,
  modalVisible: PropTypes.bool.isRequired,
};
