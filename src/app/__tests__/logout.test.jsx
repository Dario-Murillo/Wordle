import { expect, describe, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import * as supabaseClient from '../../utils/supabase/client';
import DashboardPage from '../dashboard/page';

vi.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: () => ({ email: 'dariomurillochaverri@gmail.com' }),
}));

vi.mock('../../utils/supabase/client', () => {
  const signOut = vi.fn(() => ({ error: null }));
  const getUser = vi.fn(() =>
    Promise.resolve({
      data: {
        user: { id: '948509834', email: 'dariomurillochaverri@gmail.com' },
      },
    }),
  );
  // eslint-disable-next-line no-unused-vars
  const from = () => ({
    select: vi.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          user_id: 'user-123',
          palabra: 'Piano',
          adivinada: true,
          intentos: 2,
          fecha: '2025-06-08T23:26:36.128176+00:00',
        },
      ],
      error: null,
    }),
  });
  const createClient = vi.fn(() => ({
    auth: { signOut, getUser },
    from,
  }));

  return {
    default: createClient,
    __esModule: true,
    signOut,
    getUser,
    from,
    createClient,
  };
});

vi.mock('next/navigation', () => {
  const redirectMock = vi.fn();
  const useRouter = () => ({ replace: vi.fn() });
  return {
    redirect: redirectMock,
    useRouter,
  };
});

beforeEach(() => {
  supabaseClient.getUser.mockImplementation(() =>
    Promise.resolve({
      data: { user: { email: 'dariomurillochaveri@gmail.com' } },
    }),
  );
});

describe('Logout Button', () => {
  it('se muesta el boton', async () => {
    render(<DashboardPage />);

    await act(async () => {
      expect(
        screen.getByRole('button', { name: /Cerrar sesión/i }),
      ).toBeInTheDocument();
    });
  });

  it('redirige al dashboard si se loguea correctamente', async () => {
    render(<DashboardPage />);

    const logoutButton = screen.getByRole('button', {
      name: /Cerrar Sesión/i,
    });

    await act(async () => {
      fireEvent.click(logoutButton);
      await supabaseClient.signOut.mockImplementationOnce(() => ({
        error: {},
      }));
    });
  });

  it('devuelve un mensaje de error si no se loguea correctamente', async () => {
    render(<DashboardPage />);

    const logoutButton = screen.getByRole('button', {
      name: /Cerrar Sesión/i,
    });

    await act(async () => {
      fireEvent.click(logoutButton);
      await supabaseClient.signOut.mockImplementationOnce(() => ({
        error: { error: 'Error al cerrer sesión' },
      }));
    });
  });
});
