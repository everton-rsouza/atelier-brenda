export type Obra = {
  id: string;
  titulo: string;
  descricao: string | null;
  tecnica: string | null;
  serie: string | null;
  ano: number | null;
  dimensoes: string | null;
  imagem_url: string | null;
  destaque: boolean;
  publicado: boolean;
  ordem: number;
  created_at: string;
};

export type Site = {
  nome: string;
  frase: string | null;
  historia: string | null;
  foto_url: string | null;
  email: string | null;
  instagram: string | null;
  whatsapp: string | null;
};

export type Foto = {
  id: string;
  url: string;
  legenda: string | null;
  ordem: number;
};
