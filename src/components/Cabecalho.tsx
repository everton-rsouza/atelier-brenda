import Link from "next/link";
import { Suspense } from "react";
import BotaoTema from "./BotaoTema";
import LinksMenu, { LinksEstaticos } from "./LinksMenu";

export default function Cabecalho({ nome }: { nome: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-linha/5 bg-noite/60 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="hidden text-[0.65rem] uppercase tracking-[0.35em] text-suave sm:inline">Atelier</span>
          <span className="whitespace-nowrap font-display text-xl italic text-tinta transition-colors group-hover:text-ouro-2 sm:text-2xl">
            {nome}
          </span>
          <span className="text-ouro transition-transform duration-700 group-hover:rotate-[360deg]">✦</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          {/* O destaque do link ativo depende da URL, então entra depois do carregamento */}
          <Suspense fallback={<LinksEstaticos />}>
            <LinksMenu />
          </Suspense>
          <BotaoTema />
        </div>
      </nav>
    </header>
  );
}
