import Link from "next/link";
import Image from "next/image";
import CartaoObra from "@/components/CartaoObra";
import { getObras, getSite } from "@/lib/data";

export default async function Inicio() {
  const [site, obras] = await Promise.all([getSite(), getObras()]);
  const destaques = (obras.some((o) => o.destaque) ? obras.filter((o) => o.destaque) : obras).slice(0, 6);
  const resumo = site.historia?.split("\n").find((p) => p.trim()) ?? "";

  return (
    <>
      {/* ---------- Abertura ---------- */}
      <section className="mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-5 py-20 sm:px-8">
        <p className="surgir text-xs uppercase tracking-[0.5em] text-suave">Atelier</p>
        <h1
          className="surgir mt-4 font-display text-[clamp(4rem,13vw,9.5rem)] font-medium italic leading-[0.9] text-tinta"
          style={{ animationDelay: "120ms" }}
        >
          {/* Cada palavra do nome em uma linha: "Brenda / Brito." */}
          {site.nome.split(/\s+/).map((palavra, i, todas) => (
            <span key={i} className={`block ${i > 0 ? "pl-[0.6em]" : ""}`}>
              {palavra}
              {i === todas.length - 1 && <span className="not-italic text-ouro">.</span>}
            </span>
          ))}
        </h1>
        {site.frase && (
          <p className="surgir mt-8 max-w-md text-lg text-suave sm:text-xl" style={{ animationDelay: "260ms" }}>
            {site.frase}
          </p>
        )}
        <div className="surgir mt-12 flex flex-wrap gap-4" style={{ animationDelay: "400ms" }}>
          <Link
            href="/obras"
            className="rounded-full bg-ouro px-7 py-3 font-medium text-sobre-ouro transition hover:bg-ouro-2 hover:shadow-[0_0_30px_rgba(243,197,82,0.45)]"
          >
            Ver as obras
          </Link>
          <Link
            href="/historia"
            className="rounded-full border border-linha/20 px-7 py-3 transition hover:border-ouro/70 hover:text-ouro-2"
          >
            Conhecer a história
          </Link>
        </div>
        <p className="surgir mt-16 text-xs text-suave/60" style={{ animationDelay: "800ms" }}>
          ✦ dica: se uma estrela cadente passar, tente pegá-la.
        </p>
      </section>

      {/* ---------- Destaques ---------- */}
      {destaques.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className="font-display text-4xl sm:text-5xl">Em destaque</h2>
            <Link href="/obras" className="text-sm text-suave hover:text-ouro-2">
              Todas as obras →
            </Link>
          </div>
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((o, i) => (
              <CartaoObra key={o.id} obra={o} prioridade={i < 3} />
            ))}
          </div>
        </section>
      )}

      {/* ---------- Um pouco da história ---------- */}
      <section className="mx-auto mt-32 grid max-w-6xl items-center gap-12 px-5 sm:px-8 md:grid-cols-[2fr_3fr]">
        <div className="relative aspect-square overflow-hidden rounded-full bg-noite-3 ring-1 ring-ouro/20">
          {site.foto_url ? (
            <Image src={site.foto_url} alt={site.nome} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-8xl italic text-ouro/70">
              {site.nome.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-suave">Sobre a artista</p>
          <p className="mt-5 font-display text-2xl leading-relaxed sm:text-3xl">{resumo}</p>
          <Link href="/historia" className="mt-8 inline-block text-ouro hover:text-ouro-2">
            Ler a história completa →
          </Link>
        </div>
      </section>
    </>
  );
}
