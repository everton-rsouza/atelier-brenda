import type { Metadata } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";
import CeuEstrelado from "@/components/CeuEstrelado";
import Visitas from "@/components/Visitas";
import { getObras, getSite } from "@/lib/data";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// Aplica o tema salvo antes da página aparecer (evita "piscar" o tema errado)
const scriptTema = `try{if(localStorage.getItem("tema")==="dia")document.documentElement.dataset.tema="dia"}catch(e){}`;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    title: { default: `Atelier ${site.nome}`, template: `%s · Atelier ${site.nome}` },
    description: site.frase ?? `Obras e história da artista ${site.nome}.`,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const obras = await getObras();

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body className="flex min-h-full flex-col">
        <CeuEstrelado obraIds={obras.map((o) => o.id)} />
        {children}
        <Visitas />
      </body>
    </html>
  );
}
