"use client";

import { atualizarSite } from "@/app/actions";
import { BUCKET, clienteNavegador } from "./supabase";

/** Reduz a foto (fotos de celular costumam ter 5–10 MB) antes de enviar. */
async function comprimir(arquivo: File, ladoMax = 2400): Promise<Blob> {
  if (!arquivo.type.startsWith("image/") || arquivo.type === "image/gif") return arquivo;
  try {
    const bitmap = await createImageBitmap(arquivo);
    const escala = Math.min(1, ladoMax / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * escala);
    canvas.height = Math.round(bitmap.height * escala);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/jpeg", 0.88));
    return blob && blob.size < arquivo.size ? blob : arquivo;
  } catch {
    return arquivo;
  }
}

/** Envia uma imagem para o Storage e devolve a URL pública. */
export async function enviarImagem(arquivo: File, pasta: "obras" | "atelier"): Promise<string> {
  const supabase = clienteNavegador();
  const blob = await comprimir(arquivo);
  const ext = blob.type === "image/jpeg" ? "jpg" : (arquivo.name.split(".").pop() ?? "jpg");
  const caminho = `${pasta}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(caminho, blob, {
    contentType: blob.type || arquivo.type,
    cacheControl: "31536000",
  });
  if (error) throw new Error(`Não foi possível enviar a imagem: ${error.message}`);
  return supabase.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl;
}

/** Remove do Storage uma imagem a partir da URL pública (se for nossa). */
export async function apagarImagem(url: string | null | undefined) {
  if (!url) return;
  const marcador = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marcador);
  if (i === -1) return;
  await clienteNavegador().storage.from(BUCKET).remove([url.slice(i + marcador.length)]);
}

/** Avisa o site público que algo mudou, para atualizar na hora. */
export async function publicarMudancas() {
  const { data } = await clienteNavegador().auth.getSession();
  if (data.session) await atualizarSite(data.session.access_token);
}

/** Chuva de estrelas ✦ para comemorar. */
export function celebrar(x = window.innerWidth / 2, y = window.innerHeight / 2) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const simbolos = ["✦", "✧", "★", "·", "✶"];
  for (let i = 0; i < 28; i++) {
    const el = document.createElement("span");
    const ang = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 220;
    el.textContent = simbolos[i % simbolos.length];
    Object.assign(el.style, {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      zIndex: "100",
      pointerEvents: "none",
      fontSize: `${12 + Math.random() * 18}px`,
      color: Math.random() < 0.7 ? "var(--ouro)" : "var(--estrela)",
      textShadow: "0 0 10px rgba(243,197,82,.8)",
      animation: `estourar ${0.9 + Math.random() * 0.7}s cubic-bezier(.15,.7,.3,1) forwards`,
    });
    el.style.setProperty("--dx", `${Math.cos(ang) * dist}px`);
    el.style.setProperty("--dy", `${Math.sin(ang) * dist + 60}px`);
    el.style.setProperty("--rot", `${Math.random() * 360}deg`);
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  }
}
