/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import { useEffect, useActionState } from 'react';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';
import recoveryAction from './actions';

export default function RecoveryPage() {
  const [state, formAction] = useActionState(recoveryAction, { error: null });
  const { show, message, triggerToast, closeToast } = useToast();

  useEffect(() => {
    if (state.success) {
      triggerToast(
        'Revisa tu correo para ver el enlace de recuperación.',
        'success',
      );
    }
  }, [state, triggerToast]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-karla)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center">
        <div className="p-10 bg-white rounded-2xl shadow-lg min-w-[425px] max-w-[425px] border-gray-400 border">
          {' '}
          <h1 className="mx-auto mb-1.5 font-[family-name:var(--font-alfaslabone)] text-[48px] tracking-wide sm:text-[40px] leading-[1.2] text-center text-black">
            Recuperación de Contraseña
          </h1>
          <form
            action={formAction}
            className="flex flex-col gap-4 w-full max-w-md"
          >
            <label
              data-testid="email-label"
              htmlFor="email"
              aria-label="email"
              className="text-sm mt-1.5 text-gray-700"
            >
              Correo electrónico <span className="text-red-500">*</span>
            </label>
            <input
              data-testid="email-input"
              id="email"
              name="email"
              type="email"
              placeholder="Ingresa tu correo electrónico..."
              className={`w-full p-2 border rounded text-black aria-labelledby="email-label" ${
                state.error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="mt-[-10px] flex items-center">
              {state.error && (
                <p className="text-red-500 text-sm">{state.error}</p>
              )}
            </div>
            <button
              type="submit"
              className="mt-2 cursor-pointer rounded-full font-[family-name:var(--font-karla)] border border-solid text-white bg-black font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full"
            >
              Enviar enlace de recuperación
            </button>
          </form>
        </div>
      </main>
      <Toast show={show} onClose={closeToast} message={message} />
    </div>
  );
}
