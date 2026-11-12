import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://brendabrito.vercel.app";
export const tamanhoPrevia = { width: 1200, height: 630 };

export async function fontesPrevia() {
  const cormorant = await readFile(join(process.cwd(), "src/assets/fonts/CormorantGaramond-MediumItalic.ttf"));
  return [{ name: "Cormorant", data: cormorant, style: "italic" as const, weight: 500 as const }];
}

function aleatorio(semente: number) {
  let s = semente;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function CeuPrevia() {
  const r = aleatorio(42);
  const estrelas = Array.from({ length: 140 }, () => {
    const tam = r() ** 3 * 4 + 1;
    return { x: r() * 1200, y: r() * 630, tam, dourada: r() < 0.12, alfa: 0.35 + r() * 0.65 };
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1200,
        height: 630,
        display: "flex",
        backgroundColor: "#0a0f24",
        backgroundImage:
          "radial-gradient(ellipse at 80% 0%, #22357a 0%, rgba(10,15,36,0) 60%), radial-gradient(ellipse at 0% 100%, #16245a 0%, rgba(10,15,36,0) 55%)",
      }}
    >
      <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
        <path
          d={espiral(960, 150, 230)}
          fill="none"
          stroke="rgba(130,160,240,0.16)"
          strokeWidth="2"
        />
        <path d={espiral(140, 520, 150)} fill="none" stroke="rgba(243,197,82,0.12)" strokeWidth="2" />
      </svg>
      {estrelas.map((e, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: e.x,
            top: e.y,
            width: e.tam,
            height: e.tam,
            borderRadius: 999,
            background: e.dourada ? "#f7dc8c" : "#e9ecff",
            opacity: e.alfa,
            boxShadow: e.dourada && e.tam > 2.5 ? "0 0 14px 4px rgba(247,220,140,0.55)" : "none",
          }}
        />
      ))}
    </div>
  );
}

function espiral(cx: number, cy: number, raio: number) {
  const voltas = Math.PI * 6;
  let d = "";
  for (let a = 0; a <= voltas; a += 0.1) {
    const rr = (a / voltas) * raio;
    const x = cx + Math.cos(a) * rr;
    const y = cy + Math.sin(a) * rr * 0.75;
    d += `${a === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
}

export async function imagemComoDataUri(url: string | null): Promise<string | null> {
  if (!url) return null;
  try {
    const resp = await fetch(url);
    const tipo = resp.headers.get("content-type") ?? "";
    // ImageResponse só lê JPEG e PNG
    if (!resp.ok || !/image\/(jpeg|png)/.test(tipo)) return null;
    const buf = Buffer.from(await resp.arrayBuffer());
    return `data:${tipo};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

// ✦ em SVG: a fonte Cormorant não tem esse glifo
export function Estrelinha({ tamanho = 26, cor = "#f3c552" }: { tamanho?: number; cor?: string }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" style={{ marginRight: 12 }}>
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill={cor} />
    </svg>
  );
}
