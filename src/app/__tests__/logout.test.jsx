import { expect, describe, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import * as supabaseClient from '../../utils/supabase/client';
import DashboardPage from '../dashboard/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));

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

  const order = vi.fn().mockResolvedValue({
    data: [
      {
        id: 1,
        user_id: 'user-123',
        palabra: 'PIANO',
        adivinada: true,
        intentos: 2,
        fecha: '2025-06-08',
      },
      {
        id: 2,
        user_id: 'user-123',
        palabra: 'RIVER',
        adivinada: false,
        intentos: 3,
        fecha: '2025-06-09',
      },
    ],
    error: null,
  });

  const eq = vi.fn(() => ({
    order,
  }));

  const select = vi.fn(() => ({
    eq,
  }));

  const from = vi.fn(() => ({
    select,
  }));

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
