import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as supabaseServer from '../../utils/supabase/server';
import ResetPage from '../recovery/reset/page';

vi.mock('next/navigation', () => {
  const redirectMock = vi.fn();
  const useRouter = () => ({ replace: vi.fn() });
  const useSearchParams = () => ({
    get: (key) => {
      if (key === 'token_hash') return 'abc';
      if (key === 'type') return 'recovery';
      return null;
    },
  });
  return {
    redirect: redirectMock,
    useSearchParams,
    useRouter,
  };
});

vi.mock('../../utils/supabase/server', () => {
  const updateUser = vi.fn(() => ({ error: null }));
  const createClient = vi.fn(() => ({
    auth: { updateUser },
  }));
  return {
    default: createClient,
    __esModule: true,
    updateUser,
    createClient,
  };
});

function setup(url = '/recovery/reset?token_hash=abc&type=recovery') {
  window.history.pushState({}, 'Test page', url);
  return render(<ResetPage />);
}

describe('ResetPage', () => {
  it('muestra error si no se ingresan datos', async () => {
    setup();
    const submitButton = screen.getByRole('button', { name: /Confirmar/i });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getAllByText(/Llena los campos obligatorios/i)).toHaveLength(
      2,
    );
  });

  it('muestra error si la contraseña no cumple los estándares', async () => {
    setup();
    const passwordInput = screen.getByTestId('password-input');
    const confirmationInput = screen.getByTestId('confirmation-input');
    const submitButton = screen.getByRole('button', { name: /confirmar/i });

    fireEvent.change(passwordInput, { target: { value: 'abc' } });
    fireEvent.change(confirmationInput, { target: { value: 'abc' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      screen.getAllByText(
        /La contraseña debe tener al menos 8 caracteres, una mayúscula y un número/i,
      ),
    ).toHaveLength(2);
  });

  it('muestra error si las contraseñas no coinciden', async () => {
    setup();
    const passwordInput = screen.getByTestId('password-input');
    const confirmationInput = screen.getByTestId('confirmation-input');
    const submitButton = screen.getByRole('button', { name: /confirmar/i });

    fireEvent.change(passwordInput, { target: { value: 'Admin1234' } });
    fireEvent.change(confirmationInput, { target: { value: 'Admin12345' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getAllByText(/Las contraseñas no coinciden/i)).toHaveLength(
      2,
    );
  });

  it('muestra mensaje de éxito si la contraseña es válida y coincide', async () => {
    setup();
    const passwordInput = screen.getByTestId('password-input');
    const confirmationInput = screen.getByTestId('confirmation-input');
    const submitButton = screen.getByRole('button', { name: /confirmar/i });

    fireEvent.change(passwordInput, { target: { value: 'Admin1234' } });
    fireEvent.change(confirmationInput, { target: { value: 'Admin1234' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      await screen.findByText(/Cambio de contraseña exitoso/i),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si Supabase retorna un error', async () => {
    setup();

    await supabaseServer.updateUser.mockImplementationOnce(() => ({
      error: { message: 'Error en Supabase' },
    }));

    const passwordInput = screen.getByTestId('password-input');
    const confirmationInput = screen.getByTestId('confirmation-input');
    const submitButton = screen.getByRole('button', { name: /confirmar/i });

    fireEvent.change(passwordInput, { target: { value: 'Admin1234' } });
    fireEvent.change(confirmationInput, { target: { value: 'Admin1234' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      screen.getAllByText(
        /Error al restablecer la contraseña. Intentalo de nuevo/i,
      ),
    ).toHaveLength(2);
  });
});
