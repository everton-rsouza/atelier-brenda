# ✦ Atelier Brenda

Portfólio de artes da Brenda — minimalista, com um céu à la *Noite Estrelada*.

- **Início** — "Atelier Brenda", frase de abertura e obras em destaque
- **Obras** — galeria com filtro por série e página de cada obra (técnica, ano, dimensões…)
- **História** — a trajetória da artista com foto e fotos do ateliê
- **Painel** (`/painel`, ou clique na lua ☾ no rodapé) — onde a Brenda posta e edita tudo

Detalhes divertidos: estrelas que reagem ao mouse / inclinação do celular, brilho em
redemoinho nas obras, estrela cadente que leva a uma obra surpresa quando clicada e
chuva de estrelas ao publicar.

## Rodar no computador

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Sem o Supabase configurado, o site mostra **obras de exemplo**.

## Configurar o Supabase (banco, login e imagens)

1. Crie uma conta grátis em https://supabase.com e um **New project**
   (região: *South America (São Paulo)*).
2. No projeto, abra **SQL Editor → New query**, cole todo o conteúdo de
   [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**.
3. Crie o login da Brenda: **Authentication → Users → Add user → Create new user**
   (email + senha, marque *Auto Confirm User*).
4. **Desative novos cadastros** para ninguém mais criar conta:
   **Authentication → Sign In / Providers → desmarque "Allow new users to sign up"**.
5. Em **Project Settings → API**, copie a *Project URL* e a chave *anon public*.
6. Na pasta do projeto, copie `.env.example` para `.env.local` e cole os valores.
7. Reinicie o `npm run dev` e entre em http://localhost:3000/painel ✦

## Publicar na internet (Vercel)

1. Suba o projeto para o GitHub.
2. Em https://vercel.com → **Add New → Project** → importe o repositório.
3. Em **Environment Variables**, adicione as mesmas duas variáveis do `.env.local`.
4. **Deploy**. Depois, em **Settings → Domains**, dá pra conectar um domínio
   próprio (ex.: `atelierbrenda.com.br`, registrado no Registro.br).

## Estrutura

```
src/app/(site)/        páginas públicas (início, obras, história)
src/app/painel/        painel da artista
src/app/actions.ts     atualiza o site na hora quando algo é salvo no painel
src/components/        céu estrelado, cartões, galeria e telas do painel
src/lib/data.ts        leitura dos dados (com cache)
supabase/schema.sql    tabelas, regras de segurança e bucket de imagens
```
