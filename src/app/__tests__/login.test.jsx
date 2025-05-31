import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginPage from '../login/page';

vi.mock('lucide-react', () => ({
  CircleX: () => <svg data-testid="error-icon" />,
  Eye: () => <svg />,
  EyeOff: () => <svg />,
}));

vi.mock('@/utils/supabase/server', () => ({
  default: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn(() => ({ error: null })),
    },
  })),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (key) => (key === 'error' ? 'Credenciales inválidas' : null),
  }),
  useRouter: () => ({ replace: vi.fn() }),
}));

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
});
