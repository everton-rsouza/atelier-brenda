import Link from "next/link";
import { Suspense } from "react";
import LinksMenu, { LinksEstaticos } from "./LinksMenu";

export default function Cabecalho({ nome }: { nome: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-noite/60 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.35em] text-suave">Atelier</span>
          <span className="font-display text-2xl italic text-tinta transition-colors group-hover:text-ouro-2">
            {nome}
          </span>
          <span className="text-ouro transition-transform duration-700 group-hover:rotate-[360deg]">✦</span>
        </Link>
        {/* O destaque do link ativo depende da URL, então entra depois do carregamento */}
        <Suspense fallback={<LinksEstaticos />}>
          <LinksMenu />
        </Suspense>
      </nav>
    </header>
  );
}
