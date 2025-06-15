import { useState } from 'react';

export default function useToast() {
  const [message, setMessage] = useState('');
  const [toastColor, setToastColor] = useState('#787C7E');
  const [toastTextColor, setToastTextColor] = useState('#FFFFFF');
  const [shakeRow, setShakeRow] = useState(false);

  const hideMessageAfter = (ms) => {
    setTimeout(() => setMessage(''), ms);
  };

  const showInvalidToast = (
    customMessage = 'No está en la lista de palabras.',
  ) => {
    setShakeRow(true);
    setMessage(customMessage);
    setToastColor('#FFFFFF');
    setToastTextColor('#000000');

    setTimeout(() => setShakeRow(false), 500);
    hideMessageAfter(2000);
  };

  const showLoseToast = () => {
    setMessage('⏳ ¡Te quedaste sin intentos!');
    setToastColor('#787C7E');
    setToastTextColor('#FFFFFF');
    hideMessageAfter(2000);
  };

  const showWinToast = (turn) => {
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

    setMessage(getMessageByTurn(turn));
    setToastColor('#538D4E');
    setToastTextColor('#FFFFFF');
    hideMessageAfter(2000);
  };

  return {
    message,
    toastColor,
    toastTextColor,
    shakeRow,
    showInvalidToast,
    showLoseToast,
    showWinToast,
  };
}
