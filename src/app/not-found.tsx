import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-8xl italic text-ouro">404</p>
      <p className="mt-4 text-lg text-suave">Esta página se perdeu entre as estrelas.</p>
      <Link href="/" className="mt-8 rounded-full border border-linha/20 px-6 py-2.5 hover:border-ouro/70 hover:text-ouro-2">
        Voltar ao ateliê
      </Link>
    </section>
  );
}
