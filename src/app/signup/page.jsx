/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, X, Check } from 'lucide-react';
import registerAction from './actions';

export default function signupPage() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const [state, formAction] = useActionState(registerAction, { error: null });
  const [showToast, setShowToast] = useState(true);

  const router = useRouter();
  useEffect(() => {
    if (state.success && showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        router.push('/login');
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [state.success, showToast, router]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-karla)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center">
        <div className="p-10 bg-white rounded-2xl shadow-lg min-w-[425px] max-w-[425px] border-gray-400 border">
          {' '}
          <h1 className="mx-auto mb-1.5 font-[family-name:var(--font-alfaslabone)] text-[48px] tracking-wide sm:text-[40px] leading-[1.2] text-center text-black">
            Registro
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
              id="email"
              name="email"
              type="email"
              placeholder="Ingresa tu correo electrónico..."
              className={`w-full p-2 border rounded text-black aria-labelledby="email-label" ${
                state.error &&
                (state.error === 'Correo electrónico inválido' ||
                  state.error === 'Llena los campos obligatorios')
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            <div className="mt-[-10px] flex items-center">
              {state.error &&
                (state.error === 'Correo electrónico inválido' ||
                  state.error === 'Llena los campos obligatorios') && (
                  <p className="text-red-500 text-sm">{state.error}</p>
                )}
            </div>
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
                  state.error &&
                  (state.error ===
                    'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número' ||
                    state.error === 'Llena los campos obligatorios')
                    ? 'border-red-500'
                    : 'border-gray-300'
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
              {state.error &&
                (state.error ===
                  'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número' ||
                  state.error === 'Llena los campos obligatorios') && (
                  <p className="text-red-500 text-sm">{state.error}</p>
                )}
            </div>
            <button
              type="submit"
              className="mt-2 cursor-pointer rounded-full font-[family-name:var(--font-karla)] border border-solid text-white bg-black font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full"
            >
              Registrarse
            </button>
          </form>
        </div>
      </main>
      {state.success && showToast && (
        <div
          id="toast-success"
          className="fixed bottom-6 right-6 flex items-center w-full max-w-xs p-4 mb-4 text-green-700 bg-white rounded-lg shadow-sm border border-green-400 font-[family-name:var(--font-karla)] z-50"
          role="alert"
        >
          <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-600 bg-green-100 rounded-lg">
            <Check className="w-5 h-5" />
            <span className="sr-only">Check icon</span>
          </div>
          <div className="ms-3 text-sm font-normal">
            Revisa tu correo para terminar el registro
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="ms-auto -mx-1.5 -my-1.5 bg-white text-green-400 hover:text-green-700 rounded-lg focus:ring-2 focus:ring-green-300 p-1.5 hover:bg-green-100 inline-flex items-center justify-center h-8 w-8"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
