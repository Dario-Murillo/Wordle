import { expect, describe, it, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SignupPage from '../signup/page';

const mockPush = vi.fn();

vi.mock('next/navigation', async () => {
  return {
    useRouter: () => ({
      push: mockPush,
    }),
  };
});

vi.mock('lucide-react', () => ({
  CircleX: () => <svg data-testid="error-icon" />,
  Eye: () => <svg />,
  EyeOff: () => <svg />,
  X: () => <svg />,
  Check: () => <svg />,
}));

vi.mock('../../utils/supabase/server', () => {
  const signUp = vi.fn(() => ({ error: null }));
  const createClient = vi.fn(() => ({
    auth: { signUp },
  }));
  return {
    default: createClient,
    __esModule: true,
    signUp,
    createClient,
  };
});

describe('signupPage', () => {
  it('deberia desplegar el formario de registro', () => {
    render(<SignupPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Registro' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('email-label')).toBeInTheDocument();
    expect(screen.getByTestId('password-label')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Registrarse/i }),
    ).toBeInTheDocument();
  });

  it('deberia mostrar un error si el formulario se envia vacio', async () => {
    render(<SignupPage />);
    const submitButton = screen.getByRole('button', { name: /Registrarse/i });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      screen.getAllByText(
        /Llena los campos obligatorios|Llena todos los campos/i,
      ),
    ).toHaveLength(2);
  });

  it('deberia ocultar/mostrar la contraseña al hacer click en el icono', () => {
    render(<SignupPage />);
    expect(screen.getByTestId('password-label')).toBeInTheDocument();
    const passwordInput = screen.getByTestId('password-input');
    const toggleButton = screen.getByTestId('toggle-button');

    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('deberia mostrar un error si el correo es invalido', async () => {
    render(<SignupPage />);
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByRole('button', { name: /Registrarse/i });

    fireEvent.change(emailInput, {
      target: { value: 'correo-invalido@kdslf' },
    });
    fireEvent.change(passwordInput, { target: { value: 'Contraseña123' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByText('Correo electrónico inválido')).toBeInTheDocument();
  });

  it('deberia mostrar un error si la clave es invalida', async () => {
    render(<SignupPage />);
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByRole('button', { name: /Registrarse/i });

    fireEvent.change(emailInput, {
      target: { value: 'dariomurillochaverri@gmail.com' },
    });
    fireEvent.change(passwordInput, { target: { value: 'admin' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      screen.getByText(
        'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
      ),
    ).toBeInTheDocument();
  });

  it('deberia mostrar un mensaje de exito si se registro de manera correcta', async () => {
    render(<SignupPage />);
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByRole('button', { name: /Registrarse/i });

    fireEvent.change(emailInput, {
      target: { value: 'dariomurillochaverri@gmail.com' },
    });
    fireEvent.change(passwordInput, { target: { value: 'Admin.4534!' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      screen.getByText('Revisa tu correo para terminar el registro'),
    ).toBeInTheDocument();
  });

  it('deberia redirigir a /login luego de 5 segundos si el registro fue exitoso', async () => {
    vi.useFakeTimers();

    render(<SignupPage />);
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByRole('button', { name: /Registrarse/i });

    fireEvent.change(emailInput, {
      target: { value: 'dariomurillochaverri@gmail.com' },
    });
    fireEvent.change(passwordInput, { target: { value: 'Admin.4534!' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      screen.getByText('Revisa tu correo para terminar el registro'),
    ).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(mockPush).toHaveBeenCalledWith('/login');

    vi.useRealTimers();
  });
});
