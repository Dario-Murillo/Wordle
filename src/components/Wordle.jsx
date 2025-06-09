import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useWordle from '../hooks/useWordle';
import useToast from '../hooks/useToastMessage';
import Grid from './Grid';
import EndModal from './EndModal';
import ToastMessage from './ToastMessage';
import Keyboard from './Keyboard';
import handleVirtualKey from '../hooks/handleVirtualKey';

export default function Wordle({ secretWord }) {
  const [showEndModal, setShowEndModal] = useState(false);
  const [hasShownMessage, setHasShownMessage] = useState(false);

  const {
    message,
    toastColor,
    shakeRow,
    showInvalidToast,
    showWinToast,
    showLoseToast,
  } = useToast();

  const {
    currentGuess,
    guesses,
    turn,
    isCorrect,
    validWords,
    usedKeys,
    setCurrentGuess,
    setGuesses,
    setTurn,
    setUsedKeys,
    setIsCorrect,
    addNewGuess,
    formatGuess,
    handleKeyup,
    hardMode,
  } = useWordle(secretWord, {
    onInvalidWord: showInvalidToast,
  });

  useEffect(() => {
    window.addEventListener('keyup', handleKeyup);
    const toastDelay = 1500;

    if (isCorrect && !hasShownMessage) {
      setTimeout(() => {
        showWinToast(turn);
        setHasShownMessage(true);
        setTimeout(() => setShowEndModal(true), 2000);
      }, toastDelay);

      window.removeEventListener('keyup', handleKeyup);
    }

    if (turn > 5 && !isCorrect && !hasShownMessage) {
      setTimeout(() => {
        showLoseToast();
        setHasShownMessage(true);
        setTimeout(() => setShowEndModal(true), 2000);
      }, toastDelay);

      window.removeEventListener('keyup', handleKeyup);
    }

    return () => window.removeEventListener('keyup', handleKeyup);
  }, [handleKeyup, isCorrect, turn, hasShownMessage]);

  return (
    <div className="flex flex-col justify-between h-full max-h-[calc(100vh-32px)] w-full">
      <div className="relative w-full">
        <ToastMessage message={message} bgColor={toastColor} />
      </div>
      <div className="mt-16">
        <Grid
          guesses={guesses}
          currentGuess={currentGuess}
          turn={turn}
          isCorrect={isCorrect}
          shouldShake={shakeRow}
        />
      </div>
      <Keyboard
        usedKeys={usedKeys}
        onKeyPress={(key) =>
          handleVirtualKey(
            key,
            {
              currentGuess,
              turn,
              validWords,
            },
            {
              setCurrentGuess,
              setGuesses,
              setIsCorrect,
              setTurn,
              setUsedKeys,
              solution: secretWord,
              addNewGuess,
              formatGuess,
              onInvalidWord: showInvalidToast,
              hardMode,
              guesses,
            },
          )
        }
      />

      {showEndModal && (
        <EndModal
          isCorrect={isCorrect}
          turn={turn}
          solution={secretWord}
          modalVisible={showEndModal}
        />
      )}
    </div>
  );
}

Wordle.propTypes = {
  secretWord: PropTypes.string.isRequired,
};
