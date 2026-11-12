"use client";

import { useEffect, useRef, useState } from "react";

/** Área para arrastar uma foto ou escolher do celular/computador, com prévia. */
export default function SeletorImagem({
  atual,
  aoEscolher,
  rotulo,
  redonda = false,
}: {
  atual: string | null;
  aoEscolher: (f: File) => void;
  rotulo: string;
  redonda?: boolean;
}) {
  const [previa, setPrevia] = useState<string | null>(atual);
  const [sobre, setSobre] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (previa?.startsWith("blob:")) URL.revokeObjectURL(previa);
  }, [previa]);

  function escolher(f: File | undefined) {
    if (!f || !f.type.startsWith("image/")) return;
    setPrevia(URL.createObjectURL(f));
    aoEscolher(f);
  }

  return (
    <div>
      <p className="mb-1.5 text-sm text-suave">{rotulo}</p>
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setSobre(true);
        }}
        onDragLeave={() => setSobre(false)}
        onDrop={(e) => {
          e.preventDefault();
          setSobre(false);
          escolher(e.dataTransfer.files[0]);
        }}
        className={`group relative flex w-full items-center justify-center overflow-hidden border-2 border-dashed transition ${
          redonda ? "aspect-square rounded-full" : "aspect-[3/4] rounded-2xl"
        } ${sobre ? "border-ouro bg-ouro/10" : "border-linha/15 bg-noite-2/60 hover:border-ouro/50"}`}
      >
        {previa ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previa} alt="Prévia" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-noite/80 py-2 text-sm transition sm:opacity-0 sm:group-hover:opacity-100">
              Trocar foto
            </span>
          </>
        ) : (
          <span className="px-6 text-center text-suave group-hover:text-ouro-2">
            <span className="block text-4xl">✦</span>
            <span className="mt-3 block">Arraste a foto aqui</span>
            <span className="block text-xs opacity-70">ou toque para escolher / tirar uma foto</span>
          </span>
        )}
      </button>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => escolher(e.target.files?.[0])} />
    </div>
  );
}
