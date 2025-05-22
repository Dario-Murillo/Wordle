import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../page';

test('carga Wordle heading', () => {
  render(<Home />);
  expect(
    screen.getByRole('heading', { level: 1, name: 'Wordle' }),
  ).toBeInTheDocument();
});

test('carga imagen logo', () => {
  render(<Home />);
  expect(screen.getByAltText('Wordle logo')).toBeInTheDocument();
});

test('carga texto de descripcion', () => {
  render(<Home />);
  expect(
    screen.getByText(/Adivina la palabra de 5 letras en 6 intentos/i),
  ).toBeInTheDocument();
});

test('carga ambos botones', () => {
  render(<Home />);
  expect(
    screen.getByRole('button', { name: /Iniciar Sesión/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Jugar/i })).toBeInTheDocument();
});
