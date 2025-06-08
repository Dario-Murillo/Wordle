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
      data: { user: { email: 'dariomurillochaverri@gmail.com' } },
    }),
  );
  const createClient = vi.fn(() => ({
    auth: { signOut, getUser },
  }));
  return {
    default: createClient,
    __esModule: true,
    signOut,
    getUser,
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
  it('se muesta el boton', () => {
    render(<DashboardPage />);

    expect(
      screen.getByRole('button', { name: /Cerrar sesión/i }),
    ).toBeInTheDocument();
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
