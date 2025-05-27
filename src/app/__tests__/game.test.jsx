import { expect, test, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Game from '../game/page';

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
