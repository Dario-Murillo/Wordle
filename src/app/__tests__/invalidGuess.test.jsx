import React from 'react';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  act,
  cleanup,
} from '@testing-library/react';
import Wordle from '../../components/Wordle';
import useWordle from '../../hooks/useWordle';
import useToast from '../../hooks/useToastMessage';

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
vi.mock('../../hooks/useToastMessage');

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.restoreAllMocks();
});

describe('palabras invalidas', () => {
  test('se muestra la animacion y mensaje para palabras invalidas', async () => {
    const showInvalidToast = vi.fn();

    useToast.mockReturnValue({
      message: 'No está en la lista de palabras',
      toastColor: '#787C7E',
      shakeRow: true,
      showInvalidToast,
      showLoseToast: vi.fn(),
      showWinToast: vi.fn(),
    });

    useWordle.mockReturnValue({
      currentGuess: 'asdfg',
      guesses: [null, null, null, null, null, null],
      turn: 0,
      isCorrect: false,
      handleKeyup: (event) => {
        if (event.key === 'Enter') {
          showInvalidToast();
        }
      },
    });

    render(<Wordle secretWord="apple" />);

    act(() => {
      fireEvent.keyUp(window, { key: 'Enter' });
    });

    expect(showInvalidToast).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText('No está en la lista de palabras'),
    ).toBeInTheDocument();

    const rows = screen.getAllByTestId('row');
    const rowToCheck = rows[0];
    expect(rowToCheck.className).toMatch(/shake/);
  });
});
