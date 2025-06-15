import { expect, describe, it, vi, beforeEach } from 'vitest';
import changePassword from '../dashboard/actions';

const mockGetUser = vi.fn();
const mockSignInWithPassword = vi.fn();
const mockUpdateUser = vi.fn();

const mockClient = {
  auth: {
    getUser: mockGetUser,
    signInWithPassword: mockSignInWithPassword,
    updateUser: mockUpdateUser,
  },
};

vi.mock('../../utils/supabase/server', () => ({
  __esModule: true,
  default: vi.fn(() => mockClient),
}));

describe('changePassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devuelve error si faltan campos', async () => {
    const formData = new FormData();
    // No agrega campos
    const result = await changePassword({}, formData);
    expect(result).toEqual({ error: 'Llena los campos obligatorios' });
  });

  it('devuelve error si la contraseña es inválida', async () => {
    const formData = new FormData();
    formData.set('old-password', 'oldpass');
    formData.set('new-password', 'abc');
    formData.set('confirmation-password', 'abc');
    const result = await changePassword({}, formData);
    expect(result.error).toMatch(/al menos 8 caracteres/);
  });

  it('devuelve error si las contraseñas no coinciden', async () => {
    const formData = new FormData();
    formData.set('old-password', 'oldpass');
    formData.set('new-password', 'Admin1234');
    formData.set('confirmation-password', 'Admin12345');
    const result = await changePassword({}, formData);
    expect(result.error).toMatch(/no coinciden/);
  });

  it('devuelve error si la contraseña actual es incorrecta', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { email: 'test@correo.com' } },
    });

    mockSignInWithPassword.mockResolvedValueOnce({
      error: { message: 'fail' },
    });

    const formData = new FormData();
    formData.set('old-password', 'oldpass');
    formData.set('new-password', 'Admin1234');
    formData.set('confirmation-password', 'Admin1234');
    const result = await changePassword({}, formData);
    expect(result.error).toMatch(/actual es incorrecta/);
  });

  it('devuelve error si updateUser falla', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { email: 'test@correo.com' } },
    });
    mockSignInWithPassword.mockResolvedValueOnce({ error: null });
    mockUpdateUser.mockResolvedValueOnce({
      error: { message: 'fail' },
    });

    const formData = new FormData();
    formData.set('old-password', 'oldpass');
    formData.set('new-password', 'Admin1234');
    formData.set('confirmation-password', 'Admin1234');
    const result = await changePassword({}, formData);
    expect(result.error).toMatch(/restablecer la contraseña/);
    expect(result.field).toBe('new-password');
  });

  it('devuelve success si todo sale bien', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { email: 'test@correo.com' } },
    });
    mockSignInWithPassword.mockResolvedValueOnce({ error: null });
    mockUpdateUser.mockResolvedValueOnce({ error: null });

    const formData = new FormData();
    formData.set('old-password', 'oldpass');
    formData.set('new-password', 'Admin1234');
    formData.set('confirmation-password', 'Admin1234');
    const result = await changePassword({}, formData);
    expect(result).toEqual({ success: true });
  });
});
