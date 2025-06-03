import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useWordle from '../hooks/useWordle';
import Grid from './Grid';
import EndModal from './EndModal';

export default function Wordle({ secretWord }) {
  const { currentGuess, guesses, turn, isCorrect, handleKeyup } =
    useWordle(secretWord);
  const [showEndModal, setShowEndModal] = useState(false);
  const [message, setMessage] = useState('');
  const [hasShownMessage, setHasShownMessage] = useState(false);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyup);

    if (isCorrect && !hasShownMessage) {
      const toastDelay = 1500;

      const getMessageByTurn = (winningTurn) => {
        switch (winningTurn) {
          case 1:
            return '🤯 ¡A la primera!';
          case 2:
            return '🔥 ¡Increíble!';
          case 3:
            return '👏 ¡Muy bien!';
          case 4:
            return '😊 ¡Buen trabajo!';
          case 5:
            return '😅 ¡Por poco!';
          case 6:
            return '😮 ¡Justo a tiempo!';
          default:
            return '🎉 ¡Lo lograste!';
        }
      };

      const messageByTurn = getMessageByTurn(turn);

      setTimeout(() => {
        setMessage(messageByTurn);
        setHasShownMessage(true);

        setTimeout(() => setMessage(''), 2000);
      }, toastDelay);

      setTimeout(() => setShowEndModal(true), toastDelay + 2000);

      window.removeEventListener('keyup', handleKeyup);
    }

    if (turn > 5) {
      console.log('unlucky, out of guesses');
      window.removeEventListener('keyup', handleKeyup);
    }

    return () => window.removeEventListener('keyup', handleKeyup);
  }, [handleKeyup, isCorrect, turn, hasShownMessage]);

  return (
    <div className="relative flex flex-col items-center">
      {message && (
        <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 bg-[#538D4E] text-white px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm whitespace-nowrap z-50 animate-fade">
          {message}
        </div>
      )}
      <div className="mt-16">
        <Grid
          guesses={guesses}
          currentGuess={currentGuess}
          turn={turn}
          isCorrect={isCorrect}
        />
      </div>
      <EndModal
        isCorrect={isCorrect}
        turn={turn}
        solution={secretWord}
        modalVisible={showEndModal}
      />
    </div>
  );
}

Wordle.propTypes = {
  secretWord: PropTypes.string.isRequired,
};
