import Image from 'next/image';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center">
        <Image
          className="mx-auto"
          src="/logo.svg"
          alt="Wordle logo"
          width={180}
          height={38}
          priority
        />
        <div className="flex gap-4 items-center flex-col">
          <h1 className="mx-auto font-[family-name:var(--font-alfaslabone)] text-[48px] tracking-wide sm:text-[40px] leading-[1.2] text-center text-black">
            Wordle
          </h1>
          <p className="mx-auto font-[family-name:var(--font-karla)] text-[16px] sm:text-[20px] leading-[1.2] text-black/[.8]">
            Adivina la palabra de 5 letras en 6 intentos.
          </p>
        </div>
        <div className="flex gap-4 items-center justify-center flex-col sm:flex-row w-full">
          <button
            type="button"
            className="rounded-full font-[family-name:var(--font-karla)] border-2 border-solid text-black bg-[#D9D9D9] border-black font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className="rounded-full font-[family-name:var(--font-karla)] border border-solid text-white bg-black dark:border-white/[.145] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
          >
            Jugar
          </button>
        </div>
      </main>
    </div>
  );
}
