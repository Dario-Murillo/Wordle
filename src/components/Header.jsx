'use client';

import { CircleUserRound, CircleHelp, X } from 'lucide-react';

import useAuth from '../hooks/useAuth';
import useModalVisibility from '../hooks/useModalVisibility';
import Tile from './Tile';

export default function Header() {
  const user = useAuth(false);

  const [modalVisible, shouldRenderModal, openModalBase, closeModalBase] =
    useModalVisibility();

  const handleOpenModal = () => {
    openModalBase();
  };

  const handleCloseModal = () => {
    closeModalBase();
  };

  const handleAuthClick = () => {
    if (user !== null) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <header className="w-full flex justify-end items-center font-[family-name:var(--font-karla)] py-4 px-6 bg-[#121213] border-b border-white fixed top-0 left-0 z-[60]">
      <button
        type="button"
        onClick={handleAuthClick}
        className="cursor-pointer mr-4 px-4 py-2 rounded text-white font-bold"
      >
        {user !== null ? (
          <CircleUserRound
            data-testid="user-icon"
            style={{ width: 36, height: 36 }}
          />
        ) : (
          'Iniciar sesión'
        )}
      </button>
      <CircleHelp
        type="button"
        data-testid="help-icon"
        aria-label="Mostrar reglas"
        onClick={handleOpenModal}
        className="cursor-pointer text-white text-2xl mr-10"
        style={{ width: 36, height: 36 }}
      />
      {shouldRenderModal && (
        <div className="fixed inset-0 bg-[#121213] flex items-center justify-center z-40">
          <div
            className={`relative bg-white px-8 py-8 rounded-lg shadow-lg max-w-md w-full min-h-[280px] flex flex-col items-center justify-center transform transition-all duration-500 ease-in-out
            ${modalVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
          `}
          >
            <X
              type="button"
              role="button"
              data-testid="close-modal-button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-1xl cursor-pointer text-black"
            />
            <h1 className="text-4xl font-bold font-[family-name:var(--font-alfaslabone)] mb-3 tracking-wide leading-tight text-black text-center w-full">
              ¿Cómo Jugar?
            </h1>
            <div className="text-black text-left w-full">
              <p className="font-bold">Adivina el Wordle en 6 intentos.</p>
              <ul className="list-disc pl-5 mb-2">
                <li>Cada intento debe ser una palabra válida de 5 letras. </li>
                <li>
                  El color de las fichas cambiará para mostrar qué tan cerca
                  estuvo tu intento de adivinar la palabra.
                </li>
              </ul>
              <p className="font-bold">Ejemplo:</p>
              <div className="flex flex-row gap-2 mt-2 mb-2">
                <Tile
                  letter="P"
                  bgColor="#6AAA64"
                  borderColor="#6AAA64"
                  flipDelay={0}
                />
                <Tile
                  letter="I"
                  bgColor="#C9B458"
                  borderColor="#C9B458"
                  flipDelay={0.2}
                />
                <Tile
                  letter="A"
                  bgColor="#787C7E"
                  borderColor="#787C7E"
                  flipDelay={0.4}
                />
                <Tile
                  letter="N"
                  bgColor="#787C7E"
                  borderColor="#787C7E"
                  flipDelay={0.6}
                />
                <Tile
                  letter="O"
                  bgColor="#787C7E"
                  borderColor="#787C7E"
                  flipDelay={0.8}
                />
              </div>
              <p>La P está en la palabra y en el lugar correcto. </p>
              <p>La I está en la palabra, pero en el lugar equivocado. </p>
              <p>El resto de letras no estan en la palabra. </p>
              <p className="font-bold mt-4">
                ¿Cómo funciona la dificultad difícil?
              </p>
              <p className="">
                Cualquier pista revelada debe utilizarse en conjeturas
                posteriores. Por ejemplo, en la palabra PIANO como se reveló que
                la I está se debe usar en los próximos intentos.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
