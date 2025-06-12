import React from 'react';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';
import Wordle from '../../components/Wordle';
import Grid from '../../components/Grid';
import Tile from '../../components/Tile';
import ToastMessage from '../../components/ToastMessage';
import EndModal from '../../components/EndModal';
import useWordle from '../../hooks/useWordle';

vi.mock('../../hooks/useWordle');
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
}));

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.restoreAllMocks();
});

describe('endgame', () => {
  const mockHandleKeyup = vi.fn();

  test('se muestra ToastMessage EndModal cuando se adivina la palabra', () => {
    useWordle.mockReturnValue({
      currentGuess: '',
      guesses: [['w', 'o', 'r', 'd', 's']],
      turn: 3,
      isCorrect: true,
      handleKeyup: mockHandleKeyup,
    });

    render(<Wordle secretWord="words" />);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByText('👏 ¡Muy bien!')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.queryByText('👏 ¡Muy bien!')).not.toBeInTheDocument();

    expect(screen.getByText(/words/i)).toBeInTheDocument();
  });

  test('se quita el keyup listener cuando se acaban los intentos', () => {
    const removeListenerSpy = vi.spyOn(window, 'removeEventListener');

    useWordle.mockReturnValue({
      currentGuess: '',
      guesses: Array(6).fill([]),
      turn: 6,
      isCorrect: false,
      handleKeyup: mockHandleKeyup,
    });

    render(<Wordle secretWord="words" />);

    expect(removeListenerSpy).toHaveBeenCalledWith('keyup', mockHandleKeyup);
  });

  test('despliega mensaje de exito y solucion cuando se gana', () => {
    render(<EndModal isCorrect solution="hello" modalVisible />);

    expect(screen.getByText('¡Adivinaste!')).toBeInTheDocument();

    expect(screen.getByText('La palabra era HELLO.')).toBeInTheDocument();
  });

  test('ToastMessage despliega el mensaje correcto', () => {
    render(<ToastMessage message="🔥 ¡Increíble!" />);
    expect(screen.getByText('🔥 ¡Increíble!')).toBeInTheDocument();
  });

  test('se aplican animaciones flip y jump cuando las condiciones son verdaderas', () => {
    const bgColor = '#3A3A3C';
    const borderColor = '#3A3A3C';
    const flipDelay = 0.3;
    const jumpDelay = 0.2;

    render(
      <Tile
        letter="A"
        bgColor={bgColor}
        borderColor={borderColor}
        flipDelay={flipDelay}
        shouldJump
        jumpDelay={jumpDelay}
      />,
    );

    const tile = screen.getByTestId('tile');
    const animationStyle = tile.style.animation;

    expect(animationStyle).toContain('flip');
    expect(animationStyle).toContain('jump');
    expect(animationStyle).toContain(`${flipDelay + jumpDelay}s`);
  });

  test('se setea isWinningRow correctamente', () => {
    const guesses = [
      [
        { key: 'a', color: 'green' },
        { key: 'b', color: 'green' },
        { key: 'c', color: 'green' },
        { key: 'd', color: 'green' },
        { key: 'e', color: 'green' },
      ],
    ];

    const currentGuess = '';
    const turn = 1;
    const isCorrect = true;

    render(
      <Grid
        guesses={guesses}
        currentGuess={currentGuess}
        turn={turn}
        isCorrect={isCorrect}
      />,
    );

    const rows = screen.getAllByTestId('row');
    expect(rows.length).toBe(guesses.length);

    rows.forEach((row, index) => {
      const tiles = row.querySelectorAll('[data-testid="tile"]');
      const hasJumpClass = Array.from(tiles).some((tile) =>
        tile.classList.contains('jump'),
      );

      if (index === turn - 1) {
        expect(hasJumpClass).toBe(true);
      } else {
        expect(hasJumpClass).toBe(false);
      }
    });
  });

  test('muestra mensaje de derrota y EndModal cuando se acaban los intentos', () => {
    useWordle.mockReturnValue({
      currentGuess: '',
      guesses: Array(6).fill([]),
      turn: 6,
      isCorrect: false,
      handleKeyup: vi.fn(),
    });

    render(<Wordle secretWord="words" />);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(
      screen.getByText('⏳ ¡Te quedaste sin intentos!'),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(
      screen.queryByText('⏳ ¡Te quedaste sin intentos!'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('La palabra era WORDS.')).toBeInTheDocument();
  });
});
