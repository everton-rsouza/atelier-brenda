"use client";

import { useMemo, useState } from "react";
import type { Obra } from "@/lib/types";
import CartaoObra from "./CartaoObra";

/** Grade de obras com filtro por série. */
export default function Galeria({ obras }: { obras: Obra[] }) {
  const series = useMemo(
    () => Array.from(new Set(obras.map((o) => o.serie).filter(Boolean))) as string[],
    [obras]
  );
  const [filtro, setFiltro] = useState<string | null>(null);
  const visiveis = filtro ? obras.filter((o) => o.serie === filtro) : obras;

  if (obras.length === 0) {
    return <p className="py-24 text-center text-suave">As primeiras obras estão a caminho ✦</p>;
  }

  return (
    <>
      {series.length > 1 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {[null, ...series].map((s) => {
            const ativo = filtro === s;
            return (
              <button
                key={s ?? "todas"}
                type="button"
                onClick={() => setFiltro(s)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  ativo
                    ? "border-ouro bg-ouro text-sobre-ouro"
                    : "border-linha/15 text-suave hover:border-ouro/60 hover:text-tinta"
                }`}
              >
                {s ?? "Todas"}
              </button>
            );
          })}
        </div>
      )}
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {visiveis.map((o, i) => (
          <div key={o.id} className="surgir" style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}>
            <CartaoObra obra={o} prioridade={i < 3} />
          </div>
        ))}
      </div>
    </>
  );
}
