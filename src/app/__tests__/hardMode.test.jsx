import { describe, it, expect, vi } from 'vitest';
import handleKeyup from '../../hooks/helpers/handleKeyup';
import validateHardModeGuess from '../../hooks/helpers/validateHardModeGuess';

describe('modo dificil', () => {
  it('retorna un error cuando una letra verde no se usa en la misma posicion', () => {
    const previousGuesses = [
      [
        { key: 'c', color: 'green' },
        { key: 'r', color: 'gray' },
        { key: 'a', color: 'gray' },
        { key: 'n', color: 'gray' },
        { key: 'e', color: 'gray' },
      ],
    ];
    const result = validateHardModeGuess(previousGuesses, 'brave');
    expect(result).toBe('La letra C debe estar en la posición 1.');
  });

  it('retorna un error cuando una letra amarilla no se usa', () => {
    const previousGuesses = [
      [
        { key: 'c', color: 'gray' },
        { key: 'r', color: 'yellow' },
        { key: 'a', color: 'gray' },
        { key: 'n', color: 'gray' },
        { key: 'e', color: 'gray' },
      ],
    ];
    const result = validateHardModeGuess(previousGuesses, 'blush');
    expect(result).toBe('Debes usar la letra R.');
  });

  it('no se retorna un error si todas las reglas del modo dificil se siguen', () => {
    const previousGuesses = [
      [
        { key: 'c', color: 'green' },
        { key: 'r', color: 'yellow' },
        { key: 'a', color: 'gray' },
        { key: 'n', color: 'gray' },
        { key: 'e', color: 'gray' },
      ],
    ];
    const result = validateHardModeGuess(previousGuesses, 'crook');
    expect(result).toBeNull();
  });
});

describe('validacion de modo dificil en handleKeyup', () => {
  it('se llama a onInvalidWord si las reglas del modo dificil no se siguen', () => {
    const onInvalidWord = vi.fn();
    const setCurrentGuess = vi.fn();
    const setGuesses = vi.fn();
    const setIsCorrect = vi.fn();
    const setTurn = vi.fn();
    const setUsedKeys = vi.fn();

    handleKeyup({
      key: 'Enter',
      currentGuess: 'blush',
      turn: 1,
      validWords: new Set(['blush']),
      setCurrentGuess,
      setGuesses,
      setIsCorrect,
      setTurn,
      setUsedKeys,
      solution: 'crate',
      onInvalidWord,
      hardMode: true,
      guesses: [
        [
          { key: 'c', color: 'gray' },
          { key: 'r', color: 'yellow' },
          { key: 'a', color: 'gray' },
          { key: 'n', color: 'gray' },
          { key: 'e', color: 'gray' },
        ],
      ],
    });

    expect(onInvalidWord).toHaveBeenCalledWith('Debes usar la letra R.');
    expect(setGuesses).not.toHaveBeenCalled();
  });
});
