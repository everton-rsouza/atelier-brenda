-- =====================================================================
-- Atelier Brenda — estrutura do banco
-- Cole este arquivo inteiro no Supabase: SQL Editor → New query → Run
-- =====================================================================

-- ---------- Obras ----------
create table if not exists public.obras (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  descricao   text,
  tecnica     text,          -- ex.: "Óleo sobre tela"
  serie       text,          -- ex.: "Noturnos" (usado como filtro na galeria)
  ano         int,
  dimensoes   text,          -- ex.: "40 × 60 cm"
  imagem_url  text,
  destaque    boolean not null default false,
  publicado   boolean not null default true,
  ordem       int not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------- Configurações do site (uma linha só) ----------
create table if not exists public.site (
  id         int primary key default 1 check (id = 1),
  nome       text not null default 'Brenda',
  frase      text default 'Pinturas, silêncio e céus estrelados.',
  historia   text default '',
  foto_url   text,
  email      text,
  instagram  text,
  whatsapp   text
);
insert into public.site (id) values (1) on conflict (id) do nothing;

-- ---------- Fotos da página "História" ----------
create table if not exists public.fotos (
  id         uuid primary key default gen_random_uuid(),
  url        text not null,
  legenda    text,
  ordem      int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Segurança (RLS) ----------
-- Qualquer visitante pode LER; só quem está logado (a Brenda) pode ALTERAR.
-- Lembre de desativar novos cadastros: Authentication → Sign In / Providers →
-- desmarque "Allow new users to sign up".
alter table public.obras enable row level security;
alter table public.site  enable row level security;
alter table public.fotos enable row level security;

drop policy if exists "obras publicas" on public.obras;
create policy "obras publicas" on public.obras
  for select using (publicado or auth.role() = 'authenticated');
drop policy if exists "obras admin" on public.obras;
create policy "obras admin" on public.obras
  for all to authenticated using (true) with check (true);

drop policy if exists "site publico" on public.site;
create policy "site publico" on public.site for select using (true);
drop policy if exists "site admin" on public.site;
create policy "site admin" on public.site
  for update to authenticated using (true) with check (true);

drop policy if exists "fotos publicas" on public.fotos;
create policy "fotos publicas" on public.fotos for select using (true);
drop policy if exists "fotos admin" on public.fotos;
create policy "fotos admin" on public.fotos
  for all to authenticated using (true) with check (true);

-- ---------- Storage (imagens) ----------
insert into storage.buckets (id, name, public)
values ('imagens', 'imagens', true)
on conflict (id) do nothing;

drop policy if exists "imagens publicas" on storage.objects;
create policy "imagens publicas" on storage.objects
  for select using (bucket_id = 'imagens');
drop policy if exists "imagens upload" on storage.objects;
create policy "imagens upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'imagens');
drop policy if exists "imagens update" on storage.objects;
create policy "imagens update" on storage.objects
  for update to authenticated using (bucket_id = 'imagens');
drop policy if exists "imagens delete" on storage.objects;
create policy "imagens delete" on storage.objects
  for delete to authenticated using (bucket_id = 'imagens');
