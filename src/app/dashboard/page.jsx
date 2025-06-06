/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useActionState } from 'react';
import { CircleUserRound, X, Eye, EyeOff } from 'lucide-react';
import Toast from '../../components/Toast';
import useAuth from '../../hooks/useAuth';
import createClient from '../../utils/supabase/client';
import useModalVisibility from '../../hooks/useModalVisibility';
import usePasswordVisibility from '../../hooks/usePasswordVisibility';
import useToast from '../../hooks/useToast';
import changePassword from './actions';

export default function DashboardPage() {
  const user = useAuth(null);
  const router = useRouter();
  const [modalVisible, toggleModal] = useModalVisibility();
  const [isVisible, toggleVisibility] = usePasswordVisibility();
  const [state, formAction] = useActionState(changePassword, { error: null });
  const { show, message, triggerToast, closeToast } = useToast();

  useEffect(() => {
    if (state.success) {
      triggerToast(
        'Cambio de contraseña exitoso. Ahora puedes iniciar sesión.',
        'success',
      );
    }
  }, [state, triggerToast]);

  if (!user) return null;

  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-16 min-h-screen p-8 pb-20 sm:p-20-grid-cols-1 font-[family-name:var(--font-karla)] bg-[#121213]">
      <div className="col-span-4 row-span-4 col-start-2 row-start-2">
        <h1 className="text-7xl font-bold mb-5 font-[family-name:var(--font-alfaslabone)] ">
          Dashboard
        </h1>
        <div className="flex flex-row gap-2 items-center text-4xl">
          <CircleUserRound className="w-15 h-15 text-white" />
          <p>{user.email}</p>
        </div>
        <div className="flex flex-row gap-2 items-center text-1xl mt-5">
          {/* El logout debe ser manejado en el cliente */}
          <button
            type="button"
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              router.replace('/login');
            }}
            className="bg-white text-black px-4 py-2 rounded-3xl cursor-pointer"
          >
            Cerrar sesión
          </button>
          <button
            type="button"
            onClick={toggleModal}
            className="bg-white text-black px-4 py-2 rounded-3xl cursor-pointer"
          >
            Cambiar contraseña
          </button>
        </div>
      </div>
      {modalVisible && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${modalVisible ? 'opacity-100' : 'opacity-50'}`}
        >
          {' '}
          <div
            className={`relative bg-white px-8 py-8 rounded-lg shadow-lg max-w-md w-full text-center min-h-[280px] flex flex-col items-center justify-center transform transition-all duration-500 ease-in-out
                ${modalVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
              `}
          >
            <X
              role="button"
              onClick={toggleModal}
              className="absolute top-4 right-4  text-1xl cursor-pointer text-black"
            />
            <h1 className="text-4xl font-bold font-[family-name:var(--font-alfaslabone)] mb-8 tracking-wide leading-tight text-black text-center">
              Cambiar la contraseña
            </h1>
            <form
              action={formAction}
              className="flex flex-col gap-4 w-full max-w-md"
            >
              <label
                data-testid="password-label"
                htmlFor="password"
                aria-label="contraseña"
                className="text-sm text-gray-700 text-left"
              >
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  data-testid="password-input"
                  type={isVisible ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className={`w-full p-2 border rounded text-black placeholder:text-gray-400 ${
                    state.error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa tu contraseña..."
                />
                <button
                  data-testid="toggle-button"
                  type="button"
                  onClick={toggleVisibility}
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  tabIndex={-1}
                >
                  {isVisible ? (
                    <Eye className="w-5 h-5 text-gray-500" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
              <div className="mt-[-10px] flex items-center">
                {state.error && (
                  <p className="text-red-500 text-sm">{state.error}</p>
                )}
              </div>

              <label
                data-testid="confirmation-label"
                htmlFor="password"
                aria-label="contraseña"
                className="text-sm text-gray-700 text-left"
              >
                Confirmar Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  data-testid="confirmation-input"
                  type={isVisible ? 'text' : 'password'}
                  id="password"
                  name="confirmation"
                  className={`w-full p-2 border rounded text-black placeholder:text-gray-400 ${
                    state.error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirma tu contraseña..."
                />
                <button
                  data-testid="toggle-button"
                  type="button"
                  onClick={toggleVisibility}
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  tabIndex={-1}
                >
                  {isVisible ? (
                    <Eye className="w-5 h-5 text-gray-500" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
              <div className="mt-[-10px] flex items-center">
                {state.error && (
                  <p className="text-red-500 text-sm">{state.error}</p>
                )}
              </div>
              <button
                type="submit"
                className="mt-2 cursor-pointer rounded-full font-[family-name:var(--font-karla)] border border-solid text-white bg-black font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full"
              >
                Confirmar
              </button>
            </form>
          </div>
        </div>
      )}
      <Toast show={show} onClose={closeToast} message={message} />
    </div>
  );
}
