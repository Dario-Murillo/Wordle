/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import { useActionState } from 'react';
import { Eye, EyeOff, CircleX } from 'lucide-react';
import usePasswordVisibility from '../../hooks/usePasswordVisibility';
import loginAction from './actions';

export default function LoginPage() {
  const [isVisible, toggleVisibility] = usePasswordVisibility();
  const [state, formAction] = useActionState(loginAction, { error: null });

  if (state.success) {
    window.location.href = '/dashboard';
    return null; // Prevent rendering the rest of the component
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center">
        <div className="p-10 bg-white rounded-2xl shadow-lg w-full min-w-[425px] max-w-2xl border-gray-400 border">
          <h1 className="mx-auto mb-1.5 font-[family-name:var(--font-alfaslabone)] text-[48px] tracking-wide sm:text-[40px] leading-[1.2] text-center text-black">
            Iniciar Sesión
          </h1>
          <form
            action={formAction}
            className="flex flex-col gap-4 w-full max-w-md"
          >
            {state.error && (
              <div className="flex flex-row items-center text-red-600 text-sm mt-1.5 bg-red-100 rounded-l-sm">
                <CircleX className="w-5 h-5 m-2" />
                <p>{state.error}</p>
              </div>
            )}{' '}
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
              className="p-2 border border-gray-300 rounded text-black"
              aria-labelledby="email-label"
            />
            <div className="flex flex-row">
              <label
                data-testid="password-label"
                htmlFor="password"
                aria-label="contraseña"
                className="text-sm text-gray-700"
              >
                Contraseña <span className="text-red-500">*</span>
              </label>
              <a
                href="/recovery"
                className="text-sm text-blue-500 hover:underline ml-auto"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="relative mb-4">
              <input
                data-testid="password-input"
                type={isVisible ? 'text' : 'password'}
                id="password"
                name="password"
                className="w-full p-2 border border-gray-300 rounded text-black"
                placeholder="Ingresa tu contraseña..."
              />
              <button
                data-testid="toggle-button"
                type="button"
                onClick={toggleVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3"
              >
                {isVisible ? (
                  <Eye className="w-5 h-5 text-gray-500" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="cursor-pointer rounded-full font-[family-name:var(--font-karla)] border border-solid text-white bg-black font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full"
            >
              Iniciar Sesión
            </button>
            <p className="text-sm text-gray-500 text-center">
              ¿No tienes una cuenta?{' '}
              <a href="/signup" className="text-blue-500 hover:underline">
                Regístrate aquí
              </a>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
