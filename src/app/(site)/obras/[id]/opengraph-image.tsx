import { ImageResponse } from "next/og";
import { getObra, getSite } from "@/lib/data";
import { CeuPrevia, Estrelinha, SITE_URL, fontesPrevia, imagemComoDataUri, tamanhoPrevia } from "@/lib/compartilhar";

export const alt = "Obra do Atelier Brenda Brito";
export const size = tamanhoPrevia;
export const contentType = "image/png";

export default async function Imagem({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [obra, site] = await Promise.all([getObra(id), getSite()]);
  const foto = await imagemComoDataUri(obra?.imagem_url ?? null);
  const detalhes = [obra?.tecnica, obra?.ano].filter(Boolean).join(" · ");
  const titulo = obra?.titulo ?? "Obra";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", fontFamily: "Cormorant", color: "#ece8dc" }}>
        <CeuPrevia />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", alignItems: "center", padding: "0 80px", gap: 72 }}>
          <div
            style={{
              display: "flex",
              width: 390,
              height: 520,
              flexShrink: 0,
              borderRadius: 18,
              overflow: "hidden",
              background: "#1a2450",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 60px 6px rgba(243,197,82,0.28)",
              border: "1px solid rgba(243,197,82,0.35)",
            }}
          >
            {foto ? (
              <img src={foto} alt="" width={390} height={520} style={{ objectFit: "cover", width: 390, height: 520 }} />
            ) : (
              <div style={{ width: 150, height: 150, borderRadius: 999, background: "#f3c552", boxShadow: "0 0 80px 20px rgba(243,197,82,0.35)" }} />
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ fontSize: 26, letterSpacing: 10, color: "#98a1c4", textTransform: "uppercase" }}>{`Atelier ${site.nome}`}</div>
            <div style={{ marginTop: 22, fontSize: titulo.length > 28 ? 76 : 96, lineHeight: 1.02 }}>{titulo}</div>
            {detalhes && <div style={{ marginTop: 26, fontSize: 36, color: "#c3c9e0" }}>{detalhes}</div>}
            <div style={{ marginTop: 48, display: "flex", alignItems: "center", fontSize: 28, color: "#f3c552" }}>
              <Estrelinha />{SITE_URL.replace(/^https?:\/\//, "")}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await fontesPrevia() }
  );
}
