import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import handleVirtualKey from '../../hooks/handleVirtualKey';
import addNewGuess from '../../hooks/helpers/addNewGuess';
import handleKeyup from '../../hooks/helpers/handleKeyup';
import Wordle from '../../components/Wordle';

vi.mock('../../hooks/helpers/handleKeyup', async () => {
  return {
    __esModule: true,
    default: vi.fn(),
  };
});

vi.mock('../../hooks/handleVirtualKey', async () => {
  const actual = await vi.importActual('../../hooks/handleVirtualKey');
  return {
    __esModule: true,
    default: vi.fn(actual.default),
  };
});

vi.mock('../../hooks/useWordle', () => ({
  default: () => ({
    currentGuess: '',
    guesses: [null, null, null, null, null, null],
    turn: 0,
    isCorrect: false,
    validWords: new Set(['aplex']),
    usedKeys: {},
    setCurrentGuess: vi.fn(),
    setGuesses: vi.fn(),
    setIsCorrect: vi.fn(),
    setTurn: vi.fn(),
    setUsedKeys: vi.fn(),
    addNewGuess: vi.fn(),
    formatGuess: vi.fn(),
    handleKeyup: vi.fn(),
  }),
}));

vi.mock('../../hooks/useToastMessage', () => ({
  default: () => ({
    message: '',
    toastColor: '',
    shakeRow: false,
    showInvalidToast: vi.fn(),
    showWinToast: vi.fn(),
    showLoseToast: vi.fn(),
  }),
}));

global.fetch = vi.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('apple\naplex\nhello\ntable'),
  }),
);

describe('keyboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  test('se llama a handleKeyup correctamente con el teclado virtual', () => {
    const key = 'A';

    const gameState = {
      currentGuess: '',
      turn: 0,
      validWords: new Set(['apple']),
    };

    const handlers = {
      setCurrentGuess: vi.fn(),
      setGuesses: vi.fn(),
      setIsCorrect: vi.fn(),
      setTurn: vi.fn(),
      solution: 'apple',
      addNewGuess: vi.fn(),
      formatGuess: vi.fn(),
      onInvalidWord: vi.fn(),
    };

    handleVirtualKey(key, gameState, handlers);

    expect(handleKeyup).toHaveBeenCalledWith({
      key,
      ...gameState,
      ...handlers,
    });
  });

  test('se actualiza usedKeys correctamente', () => {
    const setUsedKeys = vi.fn((updater) => {
      const prev = {};
      const updated = updater(prev);
      expect(updated).toEqual({
        h: 'gray',
        e: 'yellow',
        l: 'green',
        o: 'gray',
      });
    });

    const formattedGuess = [
      { key: 'h', color: 'gray' },
      { key: 'e', color: 'yellow' },
      { key: 'l', color: 'gray' },
      { key: 'l', color: 'green' },
      { key: 'o', color: 'gray' },
    ];

    const setGuesses = vi.fn();
    const setTurn = vi.fn();
    const setCurrentGuess = vi.fn();
    const setIsCorrect = vi.fn();

    addNewGuess({
      turn: 0,
      formattedGuess,
      currentGuess: 'hello',
      solution: 'table',
      setGuesses,
      setTurn,
      setCurrentGuess,
      setIsCorrect,
      setUsedKeys,
    });

    vi.advanceTimersByTime(1500);

    expect(setIsCorrect).not.toHaveBeenCalled();
    expect(setGuesses).toHaveBeenCalled();
    expect(setTurn).toHaveBeenCalled();
    expect(setCurrentGuess).toHaveBeenCalledWith('');
    expect(setUsedKeys).toHaveBeenCalled();
  });

  test('se llama a handleVirtualKey cuando se usa el teclado virtual', () => {
    render(<Wordle secretWord="apple" />);

    const keyButton = screen.getByRole('button', { name: 'A' });
    fireEvent.click(keyButton);

    expect(handleVirtualKey).toHaveBeenCalledWith(
      'A',
      expect.objectContaining({
        currentGuess: '',
        turn: 0,
        validWords: expect.any(Set),
      }),
      expect.objectContaining({
        setCurrentGuess: expect.any(Function),
        setGuesses: expect.any(Function),
        setIsCorrect: expect.any(Function),
        setTurn: expect.any(Function),
        setUsedKeys: expect.any(Function),
        solution: 'apple',
        addNewGuess: expect.any(Function),
        formatGuess: expect.any(Function),
        onInvalidWord: expect.any(Function),
      }),
    );
  });
});
