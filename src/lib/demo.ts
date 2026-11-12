import type { Foto, Obra, Site } from "./types";

// Dados de exemplo — aparecem só enquanto o Supabase não estiver configurado.
const base = { descricao: null, imagem_url: null, publicado: true, created_at: "2026-01-01" };

export const obrasDemo: Obra[] = [
  { ...base, id: "demo-1", titulo: "Lua sobre o campo", tecnica: "Óleo sobre tela", serie: "Noturnos", ano: 2025, dimensoes: "60 × 80 cm", destaque: true, ordem: 1,
    descricao: "Um campo silencioso sob uma lua enorme. Só o necessário: horizonte, luz e espera." },
  { ...base, id: "demo-2", titulo: "Redemoinho azul", tecnica: "Acrílica sobre tela", serie: "Noturnos", ano: 2025, dimensoes: "50 × 50 cm", destaque: true, ordem: 2,
    descricao: "Homenagem ao céu que gira — um único gesto em espiral." },
  { ...base, id: "demo-3", titulo: "Três pedras", tecnica: "Aquarela", serie: "Silêncios", ano: 2024, dimensoes: "30 × 40 cm", destaque: true, ordem: 3 },
  { ...base, id: "demo-4", titulo: "Linha do horizonte", tecnica: "Nanquim", serie: "Silêncios", ano: 2024, dimensoes: "21 × 29 cm", destaque: false, ordem: 4 },
  { ...base, id: "demo-5", titulo: "Girassol tardio", tecnica: "Óleo sobre tela", serie: "Jardins", ano: 2023, dimensoes: "40 × 50 cm", destaque: true, ordem: 5 },
  { ...base, id: "demo-6", titulo: "Janela às três da manhã", tecnica: "Acrílica sobre papel", serie: "Noturnos", ano: 2023, dimensoes: "30 × 30 cm", destaque: false, ordem: 6 },
];

export const siteDemo: Site = {
  nome: "Brenda Brito",
  frase: "Pinturas, silêncio e céus estrelados.",
  historia:
    "Este é um texto de exemplo. Aqui a Brenda vai contar a própria história: como começou a pintar, o que a inspira, por que o minimalismo — e por que a Noite Estrelada nunca saiu da cabeça dela.\n\nTudo isso é editado direto pelo painel, sem mexer em código.",
  foto_url: null,
  email: "contato@exemplo.com",
  instagram: null,
  whatsapp: null,
};

export const fotosDemo: Foto[] = [];
