import Link from "next/link";
import type { Obra } from "@/lib/types";
import ImagemObra from "./ImagemObra";

export default function CartaoObra({ obra, prioridade = false }: { obra: Obra; prioridade?: boolean }) {
  return (
    <Link href={`/obras/${obra.id}`} className="redemoinho group block rounded-xl outline-none">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-noite-2 ring-1 ring-white/5">
        <ImagemObra
          obra={obra}
          prioridade={prioridade}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3 px-1">
        <h3 className="font-display text-xl leading-tight text-tinta transition-colors group-hover:text-ouro-2">
          {obra.titulo}
        </h3>
        {obra.ano && <span className="shrink-0 text-xs tracking-widest text-suave">{obra.ano}</span>}
      </div>
      {obra.tecnica && <p className="px-1 text-sm text-suave">{obra.tecnica}</p>}
    </Link>
  );
}
