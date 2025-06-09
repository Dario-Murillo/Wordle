import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import useAuth from '../../hooks/useAuth';
import * as supabaseClient from '../../utils/supabase/client';

// Mock de next/navigation
const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

vi.mock('../../utils/supabase/client', () => {
  const getUser = vi.fn(() =>
    Promise.resolve({
      data: { user: { email: 'test@correo.com' } },
    }),
  );
  const createClient = vi.fn(() => ({
    auth: { getUser },
  }));
  return {
    default: createClient,
    __esModule: true,
    getUser,
    createClient,
  };
});

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devuelve el usuario si está autenticado', async () => {
    supabaseClient.getUser.mockResolvedValueOnce({
      data: { user: { email: 'test@correo.com' } },
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current).toEqual({ email: 'test@correo.com' });
    });
    expect(replace).not.toHaveBeenCalled();
  });

  it('redirecciona a /login si no hay usuario', async () => {
    supabaseClient.getUser.mockResolvedValueOnce({ data: { user: null } });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current).toBe(null);
    });
    expect(replace).toHaveBeenCalledWith('/login');
  });
});
