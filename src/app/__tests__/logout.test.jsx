import { expect, describe, it, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import * as supabaseClient from '../../utils/supabase/client';
import LogoutButton from '../../components/LogOutButton';

vi.mock('../../utils/supabase/client', () => {
  const signOut = vi.fn(() => ({ error: null }));
  const createClient = vi.fn(() => ({
    auth: { signOut },
  }));
  return {
    default: createClient,
    __esModule: true,
    signOut,
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

describe('Logout Button', () => {
  it('se muesta el boton', () => {
    render(<LogoutButton />);

    expect(
      screen.getByRole('button', { name: /Cerrar sesión/i }),
    ).toBeInTheDocument();
  });

  it('redirige al dashboard si se loguea correctamente', async () => {
    render(<LogoutButton />);

    const logoutButton = screen.getByRole('button', {
      name: /Cerrar Sesión/i,
    });

    await act(async () => {
      fireEvent.click(logoutButton);
    });

    await supabaseClient.signOut.mockImplementationOnce(() => ({
      error: {},
    }));
  });

  it('devuelve un mensaje de error si no se loguea correctamente', async () => {
    render(<LogoutButton />);

    const logoutButton = screen.getByRole('button', {
      name: /Cerrar Sesión/i,
    });

    await act(async () => {
      fireEvent.click(logoutButton);
    });

    await supabaseClient.signOut.mockImplementationOnce(() => ({
      error: { error: 'Error al cerrer sesión' },
    }));
  });
});
