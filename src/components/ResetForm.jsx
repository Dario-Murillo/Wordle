/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useActionState } from 'react';
import usePasswordVisibility from '../hooks/usePasswordVisibility';
import useToast from '../hooks/useToast';
import registerAction from '../app/recovery/reset/actions';
import Toast from './Toast';

export default function ResetForm() {
  const [isVisible, toggleVisibility] = usePasswordVisibility();
  const [state, formAction] = useActionState(registerAction, { error: null });
  const { show, message, triggerToast, closeToast } = useToast();

  useEffect(() => {
    if (state.success) {
      triggerToast(
        'Cambio de contraseña exitoso. Ahora puedes iniciar sesión.',
        'success',
      );
    }
  }, [state, triggerToast]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-karla)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center">
        <div className="p-10 bg-white rounded-2xl shadow-lg min-w-[425px] max-w-[425px] border-gray-400 border">
          {' '}
          <h1 className="mx-auto mb-3 font-[family-name:var(--font-alfaslabone)] text-[48px] tracking-wide sm:text-[40px] leading-[1.2] text-center text-black">
            Recuperación de Contraseña
          </h1>
          <form
            action={formAction}
            className="flex flex-col gap-4 w-full max-w-md"
          >
            <label
              data-testid="password-label"
              htmlFor="password"
              aria-label="contraseña"
              className="text-sm text-gray-700"
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
              className="text-sm text-gray-700"
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
      </main>
      <Toast show={show} onClose={closeToast} message={message} />
    </div>
  );
}
