import { expect, describe, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { redirect } from 'next/navigation';
import * as supabasServer from '../../utils/supabase/server';
import LoginPage from '../login/page';
import loginAction from '../login/actions';

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

function makeFormData(email, password) {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  return formData;
}

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

  it('deberia mostrar el mensaje de error si está presente en la URL', () => {
    render(<LoginPage />);
    const errorMessage = screen.getByText('Credenciales inválidas');
    const errorIcon = screen.getByTestId('error-icon');

    expect(errorMessage).toBeInTheDocument();
    expect(errorIcon).toBeInTheDocument();
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

  it('redirige con parametros de error si falta algun dato', async () => {
    await loginAction(makeFormData('', '123456'));
    expect(redirect).toHaveBeenCalledWith('/login?error=Faltan datos');

    await loginAction(makeFormData('test@mail.com', ''));
    expect(redirect).toHaveBeenCalledWith('/login?error=Faltan datos');
  });

  it('redirige si supabase devuelve un error', async () => {
    (
      await supabasServer.default()
    ).auth.signInWithPassword.mockResolvedValueOnce({ error: true });
    await loginAction(makeFormData('test@mail.com', '123456'));
    expect(redirect).toHaveBeenCalledWith(
      '/login?error=Credenciales invalidas',
    );
  });

  it('redirige al dashboard si se loguea correctaente', async () => {
    (
      await supabasServer.default()
    ).auth.signInWithPassword.mockResolvedValueOnce({ error: false });
    await loginAction(makeFormData('test@mail.com', '123456'));
    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });
});
