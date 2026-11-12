import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImagemObra from "@/components/ImagemObra";
import { getObra, getObras } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/obras/[id]">): Promise<Metadata> {
  const { id } = await params;
  const obra = await getObra(id);
  if (!obra) return { title: "Obra não encontrada" };
  return {
    title: obra.titulo,
    description: obra.descricao ?? [obra.tecnica, obra.ano].filter(Boolean).join(" · "),
    openGraph: obra.imagem_url ? { images: [obra.imagem_url] } : undefined,
  };
}

export default function PaginaObra({ params }: PageProps<"/obras/[id]">) {
  return (
    <Suspense fallback={<div className="mx-auto h-[70vh] max-w-6xl" />}>
      {params.then(({ id }) => (
        <DetalheObra id={id} />
      ))}
    </Suspense>
  );
}

async function DetalheObra({ id }: { id: string }) {
  const obras = await getObras();
  const i = obras.findIndex((o) => o.id === id);
  if (i === -1) notFound();
  const obra = obras[i];
  const anterior = obras[(i - 1 + obras.length) % obras.length];
  const proxima = obras[(i + 1) % obras.length];

  const ficha = [
    ["Técnica", obra.tecnica],
    ["Série", obra.serie],
    ["Ano", obra.ano],
    ["Dimensões", obra.dimensoes],
  ].filter(([, v]) => v);

  return (
    <article className="mx-auto max-w-6xl px-5 pt-12 sm:px-8">
      <Link href="/obras" className="text-sm text-suave hover:text-ouro-2">
        ← Todas as obras
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[3fr_2fr] lg:items-start">
        <div className="surgir relative aspect-[3/4] overflow-hidden rounded-xl bg-noite-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] ring-1 ring-linha/5 lg:aspect-auto lg:h-[78vh]">
          <ImagemObra obra={obra} prioridade sizes="(min-width: 1024px) 60vw, 95vw" className="lg:!object-contain" />
        </div>

        <div className="surgir lg:sticky lg:top-28" style={{ animationDelay: "150ms" }}>
          <h1 className="font-display text-5xl italic leading-tight">{obra.titulo}</h1>
          {obra.descricao && (
            <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-tinta/85">{obra.descricao}</p>
          )}
          {ficha.length > 0 && (
            <dl className="mt-10 divide-y divide-linha/5 border-y border-linha/5">
              {ficha.map(([rotulo, valor]) => (
                <div key={String(rotulo)} className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-suave">{rotulo}</dt>
                  <dd>{valor}</dd>
                </div>
              ))}
            </dl>
          )}
          <a
            href="#contato"
            className="mt-10 inline-block rounded-full border border-ouro/60 px-6 py-2.5 text-sm text-ouro-2 transition hover:bg-ouro hover:text-sobre-ouro"
          >
            Tenho interesse nesta obra
          </a>
        </div>
      </div>

      {obras.length > 1 && (
        <nav className="mt-20 flex justify-between gap-4 border-t border-linha/5 pt-8 text-sm">
          <Link href={`/obras/${anterior.id}`} className="group max-w-[45%]">
            <span className="text-suave">← Anterior</span>
            <span className="block truncate font-display text-xl group-hover:text-ouro-2">{anterior.titulo}</span>
          </Link>
          <Link href={`/obras/${proxima.id}`} className="group max-w-[45%] text-right">
            <span className="text-suave">Próxima →</span>
            <span className="block truncate font-display text-xl group-hover:text-ouro-2">{proxima.titulo}</span>
          </Link>
        </nav>
      )}
    </article>
  );
}
