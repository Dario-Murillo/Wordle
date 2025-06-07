import { expect, describe, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import DashboardPage from '../dashboard/page';
import changePassword from '../dashboard/actions';
import * as supabaseServer from '../../utils/supabase/server';

// Estado simulado del modal
let modalVisible = false;
let shouldRenderModal = false;

const openModalBase = vi.fn(() => {
  modalVisible = true;
  shouldRenderModal = true;
});

const closeModalBase = vi.fn(() => {
  modalVisible = false;
  shouldRenderModal = false;
});

vi.mock('../../hooks/useModalVisibility', () => ({
  __esModule: true,
  default: () => [
    modalVisible,
    shouldRenderModal,
    openModalBase,
    closeModalBase,
  ],
}));

// Asegúrate de limpiar el mock antes del test
const toggleMock = vi.fn();
// Sobrescribe el mock de usePasswordVisibility solo para este test
vi.mock('../../hooks/usePasswordVisibility', () => ({
  __esModule: true,
  default: () => [false, toggleMock],
}));

vi.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: () => ({ email: 'test@correo.com' }),
}));

const triggerToast = vi.fn();
vi.mock('../../hooks/useToast', () => ({
  __esModule: true,
  default: () => ({
    show: false,
    message: '',
    triggerToast,
    closeToast: vi.fn(),
  }),
}));

vi.mock('../dashboard/actions', () => {
  const mockChangePassword = vi.fn(() => Promise.resolve({ success: true }));
  return {
    __esModule: true,
    default: mockChangePassword,
  };
});

vi.mock('../../utils/supabase/server', () => {
  const getUser = vi.fn(() =>
    Promise.resolve({
      data: { user: { email: 'test@correo.com' } },
    }),
  );
  const signUp = vi.fn(() => ({ error: null }));
  const updateUser = vi.fn(() => ({ error: null }));
  const createClient = vi.fn(() => ({
    auth: { getUser, signUp, updateUser },
  }));
  return {
    default: createClient,
    __esModule: true,
    getUser,
    signUp,
    updateUser,
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
  toggleMock.mockClear();
  modalVisible = false;
  shouldRenderModal = false;
  openModalBase.mockClear();
  closeModalBase.mockClear();
});

describe('Password change', () => {
  it('se muestra el botón', () => {
    render(<DashboardPage />);
    expect(
      screen.getByRole('button', { name: /Cambiar contraseña/i }),
    ).toBeInTheDocument();
  });

  it('abre el modal si se clickea el botón', async () => {
    render(<DashboardPage />);
    const changePasswordButton = screen.getByRole('button', {
      name: /Cambiar contraseña/i,
    });

    // Simula el click y la apertura del modal
    await act(async () => {
      fireEvent.click(changePasswordButton);
    });

    // Cambia el estado del modal para simular que está abierto
    modalVisible = true;
    shouldRenderModal = true;

    // Vuelve a renderizar para reflejar el nuevo estado
    render(<DashboardPage />);

    expect(screen.getByTestId(/old-password-label/i)).toBeInTheDocument();
    expect(screen.getByTestId(/old-password-input/i)).toBeInTheDocument();
    expect(screen.getByTestId(/new-password-label/i)).toBeInTheDocument();
    expect(screen.getByTestId(/new-password-input/i)).toBeInTheDocument();
    expect(
      screen.getByTestId(/confirmation-password-label/i),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(/confirmation-password-input/i),
    ).toBeInTheDocument();
  });

  it('cierra el modal si se clickea el botón', async () => {
    const { rerender } = render(<DashboardPage />);

    const changePasswordButton = screen.getByRole('button', {
      name: /Cambiar contraseña/i,
    });

    // Simula el click y la apertura del modal
    await act(async () => {
      fireEvent.click(changePasswordButton);
    });

    // Cambia el estado del modal para simular que está abierto
    modalVisible = true;
    shouldRenderModal = true;

    rerender(<DashboardPage />);

    const closeButton = screen.getByTestId(/close-modal-button/i);

    // Simula el click en el botón de cerrar
    await act(async () => {
      fireEvent.click(closeButton);
    });

    // Cambia el estado del modal para cerrar
    modalVisible = false;
    shouldRenderModal = false;

    rerender(<DashboardPage />);

    // Ahora solo debe haber un botón "Cambiar contraseña"
    const buttons = screen.getAllByRole('button', {
      name: /Cambiar contraseña/i,
    });
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toBeInTheDocument();
  });

  it('muestra mensajes de error en todos los campos si no se ingresan datos', async () => {
    changePassword.mockImplementationOnce(() =>
      Promise.resolve({ error: 'Llena los campos obligatorios' }),
    );

    render(<DashboardPage />);
    const changePasswordButton = screen.getByRole('button', {
      name: /Cambiar contraseña/i,
    });

    await act(async () => {
      fireEvent.click(changePasswordButton);
    });

    modalVisible = true;
    shouldRenderModal = true;
    render(<DashboardPage />);

    const submitButton = screen.getByRole('button', { name: /Confirmar/i });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    const errorMessages = screen.getAllByText(/Llena los campos obligatorios/i);
    expect(errorMessages).toHaveLength(3);
  });

  it('muestra error si la contraseña no cumple los estándares', async () => {
    changePassword.mockImplementationOnce(() =>
      Promise.resolve({
        error:
          'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
      }),
    );

    render(<DashboardPage />);
    const changePasswordButton = screen.getByRole('button', {
      name: /Cambiar contraseña/i,
    });

    await act(async () => {
      fireEvent.click(changePasswordButton);
    });

    modalVisible = true;
    shouldRenderModal = true;
    render(<DashboardPage />);

    const oldPasswordInput = screen.getByTestId('old-password-input');
    const passwordInput = screen.getByTestId('new-password-input');
    const confirmationInput = screen.getByTestId('confirmation-password-input');
    const submitButton = screen.getByRole('button', { name: /confirmar/i });

    fireEvent.change(oldPasswordInput, { target: { value: 'abc' } });
    fireEvent.change(passwordInput, { target: { value: 'abc' } });
    fireEvent.change(confirmationInput, { target: { value: 'abc' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      screen.getAllByText(
        /La contraseña debe tener al menos 8 caracteres, una mayúscula y un número/i,
      ),
    ).toHaveLength(3);
  });

  it('muestra error si las contraseñas no son iguales', async () => {
    changePassword.mockImplementationOnce(() =>
      Promise.resolve({
        error: 'Las contraseñas no coinciden',
      }),
    );

    render(<DashboardPage />);
    const changePasswordButton = screen.getByRole('button', {
      name: /Cambiar contraseña/i,
    });

    await act(async () => {
      fireEvent.click(changePasswordButton);
    });

    modalVisible = true;
    shouldRenderModal = true;
    render(<DashboardPage />);

    const oldPasswordInput = screen.getByTestId('old-password-input');
    const passwordInput = screen.getByTestId('new-password-input');
    const confirmationInput = screen.getByTestId('confirmation-password-input');
    const submitButton = screen.getByRole('button', { name: /confirmar/i });

    fireEvent.change(oldPasswordInput, { target: { value: 'abc' } });
    fireEvent.change(passwordInput, { target: { value: 'Admin1234' } });
    fireEvent.change(confirmationInput, { target: { value: 'Admin123465' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getAllByText(/Las contraseñas no coinciden/i)).toHaveLength(
      3,
    );
  });

  it('muestra un mensaje de error si la contraseña actual es incorrecta', async () => {
    await supabaseServer.signUp.mockImplementationOnce(() => ({
      error: { message: 'Error en Supabase' },
    }));

    changePassword.mockImplementationOnce(() =>
      Promise.resolve({
        error: 'La contraseña actual es incorrecta',
      }),
    );

    render(<DashboardPage />);
    const changePasswordButton = screen.getByRole('button', {
      name: /Cambiar contraseña/i,
    });

    await act(async () => {
      fireEvent.click(changePasswordButton);
    });

    modalVisible = true;
    shouldRenderModal = true;
    render(<DashboardPage />);

    const oldPasswordInput = screen.getByTestId('old-password-input');
    const passwordInput = screen.getByTestId('new-password-input');
    const confirmationInput = screen.getByTestId('confirmation-password-input');
    const submitButton = screen.getByRole('button', { name: /confirmar/i });

    fireEvent.change(oldPasswordInput, { target: { value: 'abc' } });
    fireEvent.change(passwordInput, { target: { value: 'Admin1234' } });
    fireEvent.change(confirmationInput, { target: { value: 'Admin123465' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      screen.getAllByText(/La contraseña actual es incorrecta/i),
    ).toHaveLength(3);
  });

  it('muestra un mensaje de error si no se puede actualizar el usuario', async () => {
    await supabaseServer.updateUser.mockImplementationOnce(() => ({
      error: { message: 'Error en Supabase' },
    }));

    changePassword.mockImplementationOnce(() =>
      Promise.resolve({
        error: 'Error al restablecer la contraseña. Intentalo de nuevo',
      }),
    );

    render(<DashboardPage />);
    const changePasswordButton = screen.getByRole('button', {
      name: /Cambiar contraseña/i,
    });

    await act(async () => {
      fireEvent.click(changePasswordButton);
    });

    modalVisible = true;
    shouldRenderModal = true;
    render(<DashboardPage />);

    const oldPasswordInput = screen.getByTestId('old-password-input');
    const passwordInput = screen.getByTestId('new-password-input');
    const confirmationInput = screen.getByTestId('confirmation-password-input');
    const submitButton = screen.getByRole('button', { name: /confirmar/i });

    fireEvent.change(oldPasswordInput, { target: { value: 'abc' } });
    fireEvent.change(passwordInput, { target: { value: 'Admin1234' } });
    fireEvent.change(confirmationInput, { target: { value: 'Admin123465' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      screen.getAllByText(
        /Error al restablecer la contraseña. Intentalo de nuevo/i,
      ),
    ).toHaveLength(3);
  });

  it('muestra un toast de éxito si el cambio de contraseña fue exitoso', async () => {
    changePassword.mockImplementationOnce(() =>
      Promise.resolve({ success: true }),
    );

    render(<DashboardPage />);
    const changePasswordButton = screen.getByRole('button', {
      name: /Cambiar contraseña/i,
    });

    await act(async () => {
      fireEvent.click(changePasswordButton);
    });

    modalVisible = true;
    shouldRenderModal = true;
    render(<DashboardPage />);

    const oldPasswordInput = screen.getByTestId('old-password-input');
    const passwordInput = screen.getByTestId('new-password-input');
    const confirmationInput = screen.getByTestId('confirmation-password-input');
    const submitButton = screen.getByRole('button', { name: /confirmar/i });

    fireEvent.change(oldPasswordInput, { target: { value: 'abc123ABC' } });
    fireEvent.change(passwordInput, { target: { value: 'Admin1234' } });
    fireEvent.change(confirmationInput, { target: { value: 'Admin1234' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(triggerToast).toHaveBeenCalledWith('Cambio de contraseña exitoso');
  });

  it('llama a toggleVisibility cuando se hace click en el botón de mostrar/ocultar contraseña', async () => {
    render(<DashboardPage />);
    const changePasswordButton = screen.getByRole('button', {
      name: /Cambiar contraseña/i,
    });

    await act(async () => {
      fireEvent.click(changePasswordButton);
    });

    modalVisible = true;
    shouldRenderModal = true;
    render(<DashboardPage />);

    const toggleButton = screen.getAllByTestId('toggle-button')[0];
    await act(async () => {
      fireEvent.click(toggleButton);
    });

    expect(toggleMock).toHaveBeenCalled();
  });
});
