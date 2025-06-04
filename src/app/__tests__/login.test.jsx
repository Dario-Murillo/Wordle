import { expect, describe, it, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import * as supabasServer from '../../utils/supabase/server';
import LoginPage from '../login/page';

vi.mock('lucide-react', () => ({
  CircleX: () => <svg data-testid="error-icon" />,
  Eye: () => <svg />,
  EyeOff: () => <svg />,
}));

vi.mock('../../utils/supabase/server', () => {
  const signInWithPassword = vi.fn(() => ({ error: null })); // <--- aquí el cambio
  const createClient = vi.fn(() => ({
    auth: { signInWithPassword },
  }));
  return {
    default: createClient,
    __esModule: true,
    signInWithPassword,
    createClient,
  };
});

vi.mock('next/navigation', () => {
  const redirectMock = vi.fn();
  const useRouter = () => ({ replace: vi.fn() });
  const useSearchParams = () => ({
    get: (key) => (key === 'error' ? 'Credenciales inválidas' : null),
  });
  return {
    redirect: redirectMock,
    useSearchParams,
    useRouter,
  };
});

describe('LoginPage', () => {
  it('se muesta el form de inicio de sesion', () => {
    render(<LoginPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Iniciar Sesión' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('email-label')).toBeInTheDocument();
    expect(screen.getByTestId('password-label')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Iniciar Sesión/i }),
    ).toBeInTheDocument();
  });

  it('deberia tener un link para registrarse', () => {
    render(<LoginPage />);
    expect(
      screen.getByRole('link', { name: /Regístrate aquí/i }),
    ).toBeInTheDocument();
  });

  it('deberia tener un link para recuperar la contraseña', () => {
    render(<LoginPage />);
    expect(
      screen.getByRole('link', { name: /¿Olvidaste tu contraseña?/i }),
    ).toBeInTheDocument();
  });

  it('deberia ocultar/mostrar la contraseña al hacer click en el icono', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('password-label')).toBeInTheDocument();
    const passwordInput = screen.getByTestId('password-input');
    const toggleButton = screen.getByTestId('toggle-button');

    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('muestra mensaje de error si falta algun dato', async () => {
    render(<LoginPage />);
    const submitButton = screen.getByRole('button', {
      name: /Iniciar Sesión/i,
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      screen.getAllByText(
        /Llena los campos obligatorios|Llena todos los campos/i,
      ),
    ).toHaveLength(1);
  });

  it('redirige si supabase devuelve un error', async () => {
    (
      await supabasServer.default()
    ).auth.signInWithPassword.mockResolvedValueOnce({ error: true });
    render(<LoginPage />);
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByRole('button', {
      name: /Iniciar Sesión/i,
    });

    fireEvent.change(emailInput, {
      target: { value: 'correo-invalido@kdslf' },
    });
    fireEvent.change(passwordInput, { target: { value: 'Contraseña123' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByText('Error al iniciar sesión')).toBeInTheDocument();
  });

  it('redirige al dashboard si se loguea correctamente', async () => {
    // Mock window.location
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    (
      await supabasServer.default()
    ).auth.signInWithPassword.mockResolvedValueOnce({ error: false });

    render(<LoginPage />);
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByRole('button', {
      name: /Iniciar Sesión/i,
    });

    fireEvent.change(emailInput, {
      target: { value: 'correo@valido.com' },
    });
    fireEvent.change(passwordInput, { target: { value: 'Contraseña123' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(window.location.href).toBe('/dashboard');

    // Restore original location
    window.location = originalLocation;
  });
});
