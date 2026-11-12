import { ImageResponse } from "next/og";
import { getSite } from "@/lib/data";
import { CeuPrevia, Estrelinha, SITE_URL, fontesPrevia, tamanhoPrevia } from "@/lib/compartilhar";

export const alt = "Atelier Brenda Brito";
export const size = tamanhoPrevia;
export const contentType = "image/png";

export default async function Imagem() {
  const site = await getSite();
  const palavras = site.nome.split(/\s+/);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", fontFamily: "Cormorant", color: "#ece8dc" }}>
        <CeuPrevia />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 96px" }}>
          <div style={{ fontSize: 30, letterSpacing: 18, color: "#98a1c4", textTransform: "uppercase" }}>Atelier</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 12, fontSize: 168, lineHeight: 0.92 }}>
            {palavras.map((p, i) => (
              <div key={i} style={{ display: "flex", paddingLeft: i > 0 ? 100 : 0 }}>
                {p}
                {i === palavras.length - 1 && <span style={{ color: "#f3c552" }}>.</span>}
              </div>
            ))}
          </div>
          {site.frase && <div style={{ marginTop: 34, fontSize: 40, color: "#c3c9e0" }}>{site.frase}</div>}
        </div>
        <div style={{ position: "absolute", right: 64, bottom: 44, display: "flex", alignItems: "center", fontSize: 28, color: "#f3c552" }}>
          <Estrelinha />{SITE_URL.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    { ...size, fonts: await fontesPrevia() }
  );
}
