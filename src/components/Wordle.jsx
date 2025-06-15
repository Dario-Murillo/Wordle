import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useWordle from '../hooks/useWordle';
import useToast from '../hooks/useToastMessage';
import Grid from './Grid';
import EndModal from './EndModal';
import ToastMessage from './ToastMessage';
import Keyboard from './Keyboard';
import handleVirtualKey from '../hooks/handleVirtualKey';
import createClient from '../utils/supabase/client';

export default function Wordle({ secretWord }) {
  const [showEndModal, setShowEndModal] = useState(false);
  const [hasShownMessage, setHasShownMessage] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);

  const {
    message,
    toastColor,
    toastTextColor,
    shakeRow,
    showInvalidToast,
    showWinToast,
    showLoseToast,
  } = useToast();

  let initialState = {};
  const saved = localStorage.getItem('wordle_state');
  if (saved) {
    try {
      initialState = JSON.parse(saved);
    } catch {
      console.error('Game status undefined');
    }
  }

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
    initialState,
  });

  function toISODate(fecha) {
    // Convierte "13-06-2025" a "2025-06-13"
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const saveResult = async (adivinada) => {
    if (!resultSaved) {
      setResultSaved(true);
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      const date = toISODate(new Date());

      if (user) {
        const { error } = await supabase.from('Registros').insert({
          user_id: user.id,
          palabra: secretWord,
          adivinada,
          intentos: turn,
          fecha: date,
        });
        if (error) console.error('Error al guardar el resultado:', error);
      }
    }
  };

  useEffect(() => {
    // Solo guarda si la partida no ha terminado
    if (!isCorrect && turn <= 5) {
      localStorage.setItem(
        'wordle_state',
        JSON.stringify({
          turn,
          guesses,
          currentGuess,
          usedKeys,
        }),
      );
    }
  }, [turn, guesses, currentGuess, usedKeys, isCorrect]);

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
      saveResult(true);
      localStorage.clear();
    }

    if (turn > 5 && !isCorrect && !hasShownMessage) {
      setTimeout(() => {
        showLoseToast();
        setHasShownMessage(true);
        setTimeout(() => setShowEndModal(true), 2000);
      }, toastDelay);

      window.removeEventListener('keyup', handleKeyup);
      saveResult(false);
      localStorage.clear();
    }

    return () => window.removeEventListener('keyup', handleKeyup);
  }, [handleKeyup, isCorrect, turn, hasShownMessage, saveResult]);

  return (
    <div className="flex flex-col justify-between h-full max-h-[calc(100vh-32px)] w-full">
      <div className="relative w-full">
        <ToastMessage
          message={message}
          bgColor={toastColor}
          textColor={toastTextColor}
        />
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
