import Image from "next/image";
import type { Obra } from "@/lib/types";

/** Mostra a imagem da obra — ou uma pintura minimalista de exemplo no modo demonstração. */
export default function ImagemObra({
  obra,
  sizes,
  prioridade = false,
  className = "",
}: {
  obra: Pick<Obra, "id" | "titulo" | "imagem_url">;
  sizes: string;
  prioridade?: boolean;
  className?: string;
}) {
  if (obra.imagem_url) {
    return (
      <Image
        src={obra.imagem_url}
        alt={obra.titulo}
        fill
        sizes={sizes}
        priority={prioridade}
        className={`object-cover ${className}`}
      />
    );
  }
  return <PinturaDemo seed={obra.id} titulo={obra.titulo} className={className} />;
}

const composicoes = [
  // lua sobre o campo
  (c: string[]) => (
    <>
      <rect width="300" height="400" fill={c[0]} />
      <rect y="270" width="300" height="130" fill={c[1]} />
      <circle cx="190" cy="140" r="52" fill={c[2]} />
    </>
  ),
  // redemoinho
  (c: string[]) => (
    <>
      <rect width="300" height="400" fill={c[0]} />
      <path d="M150 200 m0 -10 a10 10 0 1 1 -1 0 m1 -25 a35 35 0 1 1 -1 0 m1 -25 a60 60 0 1 1 -1 0 m1 -25 a85 85 0 1 1 -1 0" fill="none" stroke={c[2]} strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  // três pedras
  (c: string[]) => (
    <>
      <rect width="300" height="400" fill={c[3]} />
      <ellipse cx="100" cy="290" rx="44" ry="30" fill={c[0]} />
      <ellipse cx="170" cy="300" rx="30" ry="20" fill={c[1]} />
      <ellipse cx="215" cy="306" rx="16" ry="11" fill={c[0]} />
    </>
  ),
  // horizonte
  (c: string[]) => (
    <>
      <rect width="300" height="400" fill={c[3]} />
      <rect y="232" width="300" height="3" fill={c[0]} />
    </>
  ),
  // girassol
  (c: string[]) => (
    <>
      <rect width="300" height="400" fill={c[1]} />
      <rect x="148" y="190" width="4" height="210" fill={c[0]} />
      <circle cx="150" cy="170" r="46" fill={c[2]} />
      <circle cx="150" cy="170" r="18" fill={c[0]} />
    </>
  ),
  // janela
  (c: string[]) => (
    <>
      <rect width="300" height="400" fill={c[0]} />
      <rect x="95" y="120" width="110" height="150" fill={c[2]} opacity="0.9" />
      <rect x="148" y="120" width="4" height="150" fill={c[0]} />
      <rect x="95" y="193" width="110" height="4" fill={c[0]} />
    </>
  ),
];

const paletas = [
  ["#1c2b5e", "#2c3f7c", "#f3c552", "#e9e3d3"],
  ["#14204a", "#d9a441", "#f7dc8c", "#ece6d6"],
  ["#2d3a66", "#8c97b8", "#e9b949", "#e4ddcb"],
];

function PinturaDemo({ seed, titulo, className }: { seed: string; titulo: string; className: string }) {
  const n = [...seed].reduce((s, ch) => s + ch.charCodeAt(0), 0);
  const comp = composicoes[n % composicoes.length];
  const pal = paletas[n % paletas.length];
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label={titulo} className={`absolute inset-0 h-full w-full ${className}`}>
      {comp(pal)}
    </svg>
  );
}
