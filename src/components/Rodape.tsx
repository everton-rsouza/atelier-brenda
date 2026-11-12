import Link from "next/link";
import type { Site } from "@/lib/types";

function linkInstagram(v: string) {
  return v.startsWith("http") ? v : `https://instagram.com/${v.replace(/^@/, "")}`;
}
function linkWhatsapp(v: string) {
  const n = v.replace(/\D/g, "");
  return `https://wa.me/${n.length <= 11 ? `55${n}` : n}`;
}

export default function Rodape({ site }: { site: Site }) {
  return (
    <footer id="contato" className="mt-32 border-t border-linha/5">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2">
        <div>
          <p className="font-display text-4xl italic">Vamos conversar?</p>
          <p className="mt-3 max-w-sm text-suave">
            Encomendas, exposições, parcerias ou só um oi — {site.nome} adora receber mensagens.
          </p>
        </div>
        <ul className="flex flex-col gap-3 md:items-end">
          {site.email && (
            <li>
              <a href={`mailto:${site.email}`} className="text-lg hover:text-ouro-2">{site.email}</a>
            </li>
          )}
          {site.whatsapp && (
            <li>
              <a href={linkWhatsapp(site.whatsapp)} target="_blank" rel="noreferrer" className="text-lg hover:text-ouro-2">
                WhatsApp
              </a>
            </li>
          )}
          {site.instagram && (
            <li>
              <a href={linkInstagram(site.instagram)} target="_blank" rel="noreferrer" className="text-lg hover:text-ouro-2">
                Instagram
              </a>
            </li>
          )}
        </ul>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 pb-10 text-xs text-suave/70 sm:px-8">
        <span>✦ Atelier {site.nome}</span>
        <Link href="/painel" className="hover:text-suave" aria-label="Painel da artista">
          ☾
        </Link>
      </div>
    </footer>
  );
}
