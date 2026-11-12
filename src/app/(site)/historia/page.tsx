import type { Metadata } from "next";
import Image from "next/image";
import { getFotos, getSite } from "@/lib/data";

export const metadata: Metadata = { title: "História" };

export default async function Historia() {
  const [site, fotos] = await Promise.all([getSite(), getFotos()]);
  const paragrafos = (site.historia ?? "").split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <article className="mx-auto max-w-6xl px-5 pt-16 sm:px-8">
      <div className="grid gap-14 md:grid-cols-[2fr_3fr] md:items-start">
        <div className="surgir md:sticky md:top-28">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-noite-3 ring-1 ring-ouro/20">
            {site.foto_url ? (
              <Image src={site.foto_url} alt={site.nome} fill priority sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center font-display text-9xl italic text-ouro/60">
                {site.nome.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="surgir" style={{ animationDelay: "150ms" }}>
          <p className="text-xs uppercase tracking-[0.4em] text-suave">A artista</p>
          <h1 className="mt-3 font-display text-6xl italic sm:text-7xl">{site.nome}</h1>
          <div className="mt-10 space-y-6 text-lg leading-relaxed text-tinta/85">
            {paragrafos.map((p, i) => (
              <p
                key={i}
                className={`whitespace-pre-line ${i === 0 ? "font-display text-2xl leading-relaxed text-tinta first-letter:float-left first-letter:mr-2 first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-ouro" : ""}`}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>

      {fotos.length > 0 && (
        <section className="mt-28">
          <h2 className="mb-10 font-display text-4xl">No ateliê</h2>
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {fotos.map((f) => (
              <figure key={f.id} className="redemoinho mb-6 break-inside-avoid rounded-xl">
                <Image
                  src={f.url}
                  alt={f.legenda ?? `Foto de ${site.nome}`}
                  width={800}
                  height={1000}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="h-auto w-full rounded-xl"
                />
                {f.legenda && <figcaption className="mt-2 px-1 text-sm text-suave">{f.legenda}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
