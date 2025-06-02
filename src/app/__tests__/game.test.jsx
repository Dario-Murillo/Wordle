import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Game from '../game/page';
import Wordle from '../../components/Wordle';
import Grid from '../../components/Grid';
import Row from '../../components/Row';
import Tile from '../../components/Tile';
import {
  formatGuess,
  addNewGuess,
  handleKeyup,
} from '../../hooks/useWordleHelpers';

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

test('carga seleccion de dificultad', () => {
  render(<Game />);
  expect(
    screen.getByRole('heading', { level: 1, name: 'Selecciona la Dificultad' }),
  ).toBeInTheDocument();
});

test('carga ambos botones de dificultad', () => {
  render(<Game />);
  expect(screen.getByRole('button', { name: /Normal/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Difícil/i })).toBeInTheDocument();
});

test('se selecciona la palabra secreta', async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve('piano\nguitar\ndrums\nflute\nviolin'),
    }),
  );

  render(<Game />);

  const normalButton = await screen.findByRole('button', { name: /Normal/i });
  fireEvent.click(normalButton);

  await waitFor(() => {
    const word = localStorage.getItem('secretWord');
    expect(word).toMatch(/piano|guitar|drums|flute|violin/);
  });
});

test('se comprueba que hay una partida iniciada', () => {
  localStorage.setItem('secretWord', 'guitar');
  localStorage.setItem('difficulty', 'normal');

  render(<Game />);

  const heading = screen.queryByText(/Selecciona la Dificultad/i);
  expect(heading).not.toBeInTheDocument();
});

test('se escribe a consola un mensaje de error si no cargan las palabras', async () => {
  global.fetch = vi.fn(() => Promise.reject(new Error('Failed to fetch')));

  const consoleErrorSpy = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  render(<Game />);

  const normalButton = await screen.findByRole('button', { name: /Normal/i });
  fireEvent.click(normalButton);

  await waitFor(() => {
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to load words:',
      expect.any(Error),
    );
  });
});

test('se despliega la matriz', () => {
  const guesses = [null, null, null, null, null, null];
  const currentGuess = '';
  const turn = 0;

  render(<Grid guesses={guesses} currentGuess={currentGuess} turn={turn} />);

  const rows = screen.getAllByTestId('row');
  expect(rows).toHaveLength(6);
});

test('intentos anteriores se muestran en la matriz con el color correspondiente', () => {
  const guesses = [
    [
      { key: 'w', color: 'gray' },
      { key: 'o', color: 'gray' },
      { key: 'r', color: 'gray' },
      { key: 'd', color: 'gray' },
      { key: 's', color: 'gray' },
    ],
    null,
    null,
    null,
    null,
    null,
  ];
  const currentGuess = '';
  const turn = 1;

  render(<Grid guesses={guesses} currentGuess={currentGuess} turn={turn} />);

  const tiles = screen.queryAllByTestId('tile');

  expect(tiles[0].textContent).toBe('w');
  expect(tiles[0].style.getPropertyValue('--background')).toBe('#3A3A3C');
});

test('fila despliega letras escritas y casillas vacias para el intento actual', () => {
  const currentGuess = 'wo';
  const guess = null;

  render(<Row currentGuess={currentGuess} guess={guess} />);

  const row = screen.getByTestId('row');
  expect(row).toBeInTheDocument();

  const tiles = screen.getAllByTestId('tile');
  expect(tiles).toHaveLength(5);

  expect(tiles[0].textContent).toBe('w');
  expect(tiles[1].textContent).toBe('o');
  expect(tiles[2].textContent).toBe('');

  expect(tiles[0]).toHaveStyle({ borderColor: '#565758' });
  expect(tiles[2]).toHaveStyle({ borderColor: '#3A3A3C' });
});

test('formateo del intento a un array de objetos con cada letra y su color', () => {
  const guess = 'hello';
  const secretWord = 'table';
  const expected = [
    { key: 'h', color: 'gray' },
    { key: 'e', color: 'yellow' },
    { key: 'l', color: 'gray' },
    { key: 'l', color: 'green' },
    { key: 'o', color: 'gray' },
  ];

  expect(formatGuess(secretWord, guess)).toEqual(expected);
});

test('formateo del intento retorna un array vacio si el intento es vacio', () => {
  const secretWord = 'table';
  expect(formatGuess(secretWord, '')).toEqual([]);
});

test('addNewGuess actualiza los intentos y resetea currentGuess', () => {
  const turn = 0;
  const currentGuess = 'hello';
  const solution = 'world';

  const formatted = [
    { key: 'h', color: 'gray' },
    { key: 'e', color: 'gray' },
    { key: 'l', color: 'gray' },
    { key: 'l', color: 'gray' },
    { key: 'o', color: 'gray' },
  ];

  const mockSetGuesses = vi.fn();
  const mockSetTurn = vi.fn();
  const mockSetCurrentGuess = vi.fn();
  const mockSetIsCorrect = vi.fn();

  addNewGuess({
    turn,
    formattedGuess: formatted,
    currentGuess,
    solution,
    setGuesses: mockSetGuesses,
    setTurn: mockSetTurn,
    setCurrentGuess: mockSetCurrentGuess,
    setIsCorrect: mockSetIsCorrect,
  });

  expect(mockSetGuesses).toHaveBeenCalledTimes(1);
  const setGuessesCallback = mockSetGuesses.mock.calls[0][0];
  expect(typeof setGuessesCallback).toBe('function');

  const prevGuesses = [null, null, null, null, null, null];
  const updatedGuesses = setGuessesCallback(prevGuesses);
  expect(updatedGuesses).toEqual([formatted, null, null, null, null, null]);

  expect(mockSetTurn).toHaveBeenCalledTimes(1);
  const setTurnCallback = mockSetTurn.mock.calls[0][0];
  expect(typeof setTurnCallback).toBe('function');
  expect(setTurnCallback(0)).toBe(1);

  expect(mockSetCurrentGuess).toHaveBeenCalledWith('');
});


describe('handleKeyup', () => {
  let mockSetCurrentGuess;
  let mockSetGuesses;
  let mockSetTurn;
  let mockAddNewGuess;
  let mockFormatGuess;
  let validWords;

  beforeEach(() => {
    mockSetCurrentGuess = vi.fn();
    mockSetGuesses = vi.fn();
    mockSetTurn = vi.fn();
    mockAddNewGuess = vi.fn();
    mockFormatGuess = vi.fn().mockReturnValue([
      { key: 't', color: 'green' },
      { key: 'a', color: 'green' },
      { key: 'b', color: 'green' },
      { key: 'l', color: 'green' },
      { key: 'e', color: 'green' },
    ]);
    validWords = new Set(['table']);
  });

test('se permite ingresar un intento válido con Enter', () => {
  const solution = 'table';
  const currentGuess = 'table';

  const formattedGuess = [
    { key: 't', color: 'green' },
    { key: 'a', color: 'green' },
    { key: 'b', color: 'green' },
    { key: 'l', color: 'green' },
    { key: 'e', color: 'green' },
  ];

  const mockSetCurrentGuess = vi.fn();
  const mockSetGuesses = vi.fn();
  const mockSetTurn = vi.fn();
  const mockSetIsCorrect = vi.fn();

  const mockFormatGuess = vi.fn(() => formattedGuess);
  const mockAddNewGuess = vi.fn();

  const validWords = new Set(['table']);

  handleKeyup({
    key: 'Enter',
    currentGuess,
    turn: 2,
    validWords,
    setCurrentGuess: mockSetCurrentGuess,
    setGuesses: mockSetGuesses,
    setTurn: mockSetTurn,
    setIsCorrect: mockSetIsCorrect,
    solution,
    addNewGuess: mockAddNewGuess,
    formatGuess: mockFormatGuess,
  });

  expect(mockFormatGuess).toHaveBeenCalledWith(solution, currentGuess);

  expect(mockAddNewGuess).toHaveBeenCalledWith({
    turn: 2,
    formattedGuess,
    currentGuess,
    solution,
    setGuesses: mockSetGuesses,
    setTurn: mockSetTurn,
    setCurrentGuess: mockSetCurrentGuess,
    setIsCorrect: mockSetIsCorrect,
  });
});

  test('letras del intento actual se quitan con Backspace', () => {
    handleKeyup({
      key: 'Backspace',
      currentGuess: 'test',
      turn: 0,
      validWords,
      setCurrentGuess: mockSetCurrentGuess,
      setGuesses: mockSetGuesses,
      setTurn: mockSetTurn,
      addNewGuess: mockAddNewGuess,
      formatGuess: mockFormatGuess,
    });

    expect(mockSetCurrentGuess).toHaveBeenCalled();
    const callback = mockSetCurrentGuess.mock.calls[0][0];
    expect(callback('test')).toBe('tes');
  });

  test('se agregan letras a currentGuess si tiene menos de 5 letras', () => {
    handleKeyup({
      key: 'a',
      currentGuess: 'te',
      turn: 0,
      validWords,
      setCurrentGuess: mockSetCurrentGuess,
      setGuesses: mockSetGuesses,
      setTurn: mockSetTurn,
      addNewGuess: mockAddNewGuess,
      formatGuess: mockFormatGuess,
    });

    expect(mockSetCurrentGuess).toHaveBeenCalled();
    const callback = mockSetCurrentGuess.mock.calls[0][0];
    expect(callback('te')).toBe('tea');
  });
});

test('no se registra el intento si turn > 5', () => {
  const mockSetCurrentGuess = vi.fn();
  const mockSetGuesses = vi.fn();
  const mockSetTurn = vi.fn();
  const mockAddNewGuess = vi.fn();
  const mockFormatGuess = vi.fn();

  handleKeyup({
    key: 'Enter',
    currentGuess: 'hello',
    turn: 6,
    validWords: new Set(['hello']),
    setCurrentGuess: mockSetCurrentGuess,
    setGuesses: mockSetGuesses,
    setTurn: mockSetTurn,
    addNewGuess: mockAddNewGuess,
    formatGuess: mockFormatGuess,
  });

  expect(mockFormatGuess).not.toHaveBeenCalled();
  expect(mockAddNewGuess).not.toHaveBeenCalled();
});

test('no se registra el intento si tiene menos de 5 letras', () => {
  const mockSetCurrentGuess = vi.fn();
  const mockSetGuesses = vi.fn();
  const mockSetTurn = vi.fn();
  const mockAddNewGuess = vi.fn();
  const mockFormatGuess = vi.fn();

  handleKeyup({
    key: 'Enter',
    currentGuess: 'hi',
    turn: 2,
    validWords: new Set(['hello']),
    setCurrentGuess: mockSetCurrentGuess,
    setGuesses: mockSetGuesses,
    setTurn: mockSetTurn,
    addNewGuess: mockAddNewGuess,
    formatGuess: mockFormatGuess,
  });

  expect(mockFormatGuess).not.toHaveBeenCalled();
  expect(mockAddNewGuess).not.toHaveBeenCalled();
});

test('handleKeyup permite ingresar el intento', async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve('hello\nworld\ntable\nghost'),
    }),
  );

  render(<Wordle secretWord="ghost" />);

  fireEvent.keyUp(window, { key: 'h' });
  fireEvent.keyUp(window, { key: 'e' });
  fireEvent.keyUp(window, { key: 'l' });
  fireEvent.keyUp(window, { key: 'l' });
  fireEvent.keyUp(window, { key: 'o' });

  await waitFor(() => {
    const tiles = screen.getAllByTestId('tile');
    const letters = tiles.map((tile) => tile.textContent).join('');
    expect(letters.startsWith('hello')).toBe(true);
  });

  fireEvent.keyUp(window, { key: 'Enter' });

  await waitFor(() => {
    const tiles = screen.getAllByTestId('tile');
    const letters = tiles.map((tile) => tile.textContent).join('');
    expect(letters.startsWith('hello')).toBe(true);
    expect(letters.slice(5, 10)).toBe('');
  });
});

test('tile tiene la clase flip cuando se le pasa bgColor', () => {
  render(
    <Tile letter="w" bgColor="#3A3A3C" borderColor="#3A3A3C" flipDelay={0} />,
  );

  const tile = screen.getByTestId('tile');
  expect(tile).toHaveClass('flip');
});

test('tile no tiene la clase flip cuando no se le pasa bgColor', () => {
  render(<Tile letter="w" />);
  const tile = screen.getByTestId('tile');
  expect(tile).not.toHaveClass('flip');
});

test('tile setea el retraso de animacion correctamente', () => {
  render(
    <Tile letter="w" bgColor="#3A3A3C" borderColor="#3A3A3C" flipDelay={0.3} />,
  );

  const tile = screen.getByTestId('tile');
  expect(tile.style.animationDelay).toBe('0.3s');
});
