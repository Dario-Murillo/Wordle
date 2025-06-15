import { expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RootLayout from '../layout';
import Home from '../page';

const mockPush = vi.fn();

vi.mock('next/navigation', async () => {
  return {
    useRouter: () => ({
      push: mockPush,
    }),
  };
});

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

test('carga layout', () => {
  vi.mock('next/font/google', () => ({
    Karla: () => ({ variable: 'karla' }),
    Alfa_Slab_One: () => ({ variable: 'alfaslabone' }),
  }));

  render(
    <RootLayout>
      <Home />
    </RootLayout>,
  );
  expect(screen.getByRole('main')).toBeInTheDocument();
});

test('carga layout con children', () => {
  vi.mock('next/font/google', () => ({
    Karla: () => ({ variable: 'karla' }),
    Alfa_Slab_One: () => ({ variable: 'alfaslabone' }),
  }));

  render(
    <RootLayout>
      <h1>Hola</h1>
    </RootLayout>,
  );
  expect(
    screen.getByRole('heading', { level: 1, name: 'Hola' }),
  ).toBeInTheDocument();
});

test('boton de jugar lleva a la pantalla del juego', () => {
  render(<Home />);

  const playButton = screen.getByRole('button', { name: /Jugar/i });
  fireEvent.click(playButton);

  expect(mockPush).toHaveBeenCalledWith('/game');
});
