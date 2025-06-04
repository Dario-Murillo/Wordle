import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useWordle from '../hooks/useWordle';
import Grid from './Grid';
import EndModal from './EndModal';
import ToastMessage from './ToastMessage';

export default function Wordle({ secretWord }) {
  const { currentGuess, guesses, turn, isCorrect, handleKeyup } =
    useWordle(secretWord);
  const [showEndModal, setShowEndModal] = useState(false);
  const [message, setMessage] = useState('');
  const [hasShownMessage, setHasShownMessage] = useState(false);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyup);
    const toastDelay = 1500;

    if (isCorrect && !hasShownMessage) {
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

    if (turn > 5 && !hasShownMessage) {
      setTimeout(() => {
        setMessage('⏳ ¡Te quedaste sin intentos!');
        setHasShownMessage(true);

        setTimeout(() => setMessage(''), 2000);
      }, toastDelay);

      setTimeout(() => setShowEndModal(true), toastDelay + 2000);

      window.removeEventListener('keyup', handleKeyup);
    }

    return () => window.removeEventListener('keyup', handleKeyup);
  }, [handleKeyup, isCorrect, turn, hasShownMessage]);

  return (
    <div className="relative flex flex-col items-center">
      <ToastMessage message={message} />
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
