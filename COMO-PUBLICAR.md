# agenda BRUNA — Como colocar 100% online (GitHub + Supabase)

Você escolheu: **HTML puro + JS, sem login, dados no Supabase, código no GitHub.**

## PARTE 1 — Supabase (5 min, banco online)

1. Acesse https://supabase.com > Sign Up (pode usar conta GitHub).
2. New Project > nome `agenda-bruna` > senha forte > região `South America (São Paulo)` > Create.
3. Aguarde ~2 min. Depois vá em **SQL Editor > New query**.
4. Abra o arquivo `supabase-schema.sql` deste projeto, copie TUDO, cole no SQL Editor e clique **Run**.
   - Isso cria `categorias` + `transacoes` e já cadastra categorias iniciais.
5. Vá em **Project Settings > API** e copie:
   - `Project URL` (ex: https://xyz.supabase.co)
   - `anon public key`
6. Abra `config.js` e cole os 2 valores no lugar de `COLE_AQUI...`.

Pronto: banco online, sem nada em LocalStorage.

## PARTE 2 — GitHub (código online)

1. Crie conta em https://github.com se não tiver.
2. New repository > nome `agenda-BRUNA` > Public > Create.
3. Nesta pasta, suba os arquivos (`index.html`, `app.js`, `styles.css`, `config.js`, `supabase-schema.sql`):
   - Pelo site: Add file > Upload files > arraste tudo > Commit.
   - Ou pelo terminal:
     ```
     git init
     git add .
     git commit -m "financeiro v1"
     git branch -M main
     git remote add origin https://github.com/SEU-USUARIO/agenda-BRUNA.git
     git push -u origin main
     ```

## PARTE 3 — Deploy grátis (site no ar)

Opção mais simples (só GitHub, sem Vercel):

1. No repo > **Settings > Pages** > Source: `Deploy from a branch` > Branch: `main` + `/ (root)` > Save.
2. Aguarde 1-2 min. O link será `https://SEU-USUARIO.github.io/agenda-BRUNA/`.
3. Abra no celular/PC: é sua aplicação real, lendo do Supabase.

> Como é HTML puro, não precisa Vercel/Netlify. Se um dia migrar para Next.js, a gente conecta na Vercel.

## Como usar o Financeiro

- **1) Categorias:** cadastre primeiro, separadas por Entrada/Gasto. Ex: Saúde (gasto), Salário (entrada).
- **2) Lançamento:** tipo + categoria (obrigatória) + nome + data + valor + fixa? + pagamento.
- **Fixas:** ao trocar de mês, o bloco "Sugestões fixas" lista o que era fixo e ainda não foi lançado. Confira data/valor > Confirmar.
- **Tabela:** lado esquerdo Entradas, direito Gastos, com editar/excluir.
- **Gráficos:** pizza por categoria no mês + barra(gasto)/linha(recebido) últimos 13 meses a partir do mês selecionado.

## Segurança (importante, você optou por sem login)

As policies criadas liberam leitura/escrita para quem tiver o link + anon key. Para uso pessoal ok, mas não compartilhe a key publicamente. Quando quiser, eu adiciono login do Supabase Auth e travo por usuário.

## Próximos módulos

Me diga as regras do cartão de crédito e depois partimos para estudos, trabalho e planner mensal. A estrutura já permite novas tabelas sem quebrar o financeiro.
