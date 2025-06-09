import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Header from '../../components/Header';
import useAuth from '../../hooks/useAuth';
import GameLayout from '../game/layout';

let modalVisible = false;
let shouldRenderModal = false;

const openModalBase = vi.fn(() => {
  modalVisible = true;
  shouldRenderModal = true;
});

const closeModalBase = vi.fn(() => {
  modalVisible = false;
  shouldRenderModal = false;
});

beforeEach(() => {
  modalVisible = false;
  shouldRenderModal = false;
  openModalBase.mockClear();
  closeModalBase.mockClear();
});

// Mock del App Router (next/navigation)
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

// Mock de supabase y hooks de autenticación
vi.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('../../hooks/useModalVisibility', () => ({
  __esModule: true,
  default: () => [
    modalVisible,
    shouldRenderModal,
    openModalBase,
    closeModalBase,
  ],
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el botón para consultar las reglas', () => {
    useAuth.mockReturnValue(null);
    render(<Header />);
    expect(screen.getByTestId('help-icon')).toBeInTheDocument();
  });

  it('muestra las reglas al presionar el botón', async () => {
    useAuth.mockReturnValue(null);
    render(<Header />);
    const rulesButton = screen.getByTestId('help-icon');

    await act(async () => {
      fireEvent.click(rulesButton);
    });

    render(<Header />);

    modalVisible = true;
    shouldRenderModal = true;

    expect(
      screen.getByText(/Adivina el Wordle en 6 intento./i),
    ).toBeInTheDocument();
  });

  it('muestra el botón "Iniciar sesión" si no hay usuario', () => {
    useAuth.mockReturnValue(null); // No logueado
    render(<Header />);
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
  });

  it('muestra el icono de usuario si hay usuario logueado', () => {
    useAuth.mockReturnValue({ email: 'test@correo.com' }); // Logueado
    render(<Header />);

    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  it('renderiza el Header en el layout de game', () => {
    useAuth.mockReturnValue(null);
    render(
      <GameLayout>
        <div>Contenido de prueba</div>
      </GameLayout>,
    );

    expect(screen.getByTestId('help-icon')).toBeInTheDocument();
    expect(screen.getByText(/contenido de prueba/i)).toBeInTheDocument();
  });

  it('cierra el modal al hacer click en la X', async () => {
    useAuth.mockReturnValue(null);

    modalVisible = true;
    shouldRenderModal = true;
    render(<Header />);
    const closeButton = screen.getByTestId('close-modal-button');
    expect(closeButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(closeButton);
    });

    // Verifica que la función closeModalBase fue llamada
    expect(closeModalBase).toHaveBeenCalled();
  });

  it('redirige al dashboard si el usuario está logueado y hace click en el botón de usuario', () => {
    useAuth.mockReturnValue({ email: 'test@correo.com' });
    global.window = Object.create(window);
    const location = { href: '' };
    Object.defineProperty(window, 'location', {
      value: location,
      writable: true,
    });

    render(<Header />);
    const userButton = screen.getByTestId('user-icon').closest('button');
    fireEvent.click(userButton);
    expect(window.location.href).toBe('/dashboard');
  });

  it('redirige al login si el usuario NO está logueado y hace click en el botón', () => {
    useAuth.mockReturnValue(null);
    global.window = Object.create(window);
    const location = { href: '' };
    Object.defineProperty(window, 'location', {
      value: location,
      writable: true,
    });

    render(<Header />);
    const loginButton = screen.getByText(/iniciar sesión/i);
    fireEvent.click(loginButton);
    expect(window.location.href).toBe('/login');
  });
});
