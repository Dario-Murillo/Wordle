import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import RecoveryPage from '../recovery/page';

vi.mock('../../utils/supabase/server', () => {
  const resetPasswordForEmail = vi.fn(() => ({ error: null }));
  const createClient = vi.fn(() => ({
    auth: { resetPasswordForEmail },
  }));
  return {
    default: createClient,
    __esModule: true,
    resetPasswordForEmail,
    createClient,
  };
});

describe('RecoveryPage', () => {
  it('muestra un error si no se ingresan datos', async () => {
    render(<RecoveryPage />);
    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByRole('button', {
      name: /enviar enlace de recuperación/i,
    });

    fireEvent.change(emailInput, { target: { value: '' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      await screen.findByText(/Llena los campos obligatorios/i),
    ).toBeInTheDocument();
  });

  it('muestra un error si el correo es inválido', async () => {
    render(<RecoveryPage />);
    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByRole('button', {
      name: /enviar enlace de recuperación/i,
    });

    fireEvent.change(emailInput, { target: { value: 'correo@invalido' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      await screen.findByText(/Correo electrónico inválido/i),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de éxito si el correo es válido', async () => {
    render(<RecoveryPage />);
    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByRole('button', {
      name: /enviar enlace de recuperación/i,
    });

    fireEvent.change(emailInput, { target: { value: 'test@email.com' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      await screen.findByText(
        /revisa tu correo para ver el enlace de recuperación/i,
      ),
    ).toBeInTheDocument();
  });
});
