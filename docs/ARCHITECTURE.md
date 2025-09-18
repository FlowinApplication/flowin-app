# Flowin App - Arquitetura e Funcionamento

> Documento introdutório: explica o que existe hoje no repositório, como o Next.js (App Router) funciona conceitualmente. Use isto como base evolutiva.

---
## 1. Visão Geral do Repositório Atual

Estrutura relevante:
```
root/
  package.json
  next.config.ts
  src/
    app/
      layout.tsx
      page.tsx
    globals.css (injetado via import em layout)
```
Dependências principais atuais (package.json):
- next 15.x (App Router por padrão)
- react / react-dom 19.x
- @clerk/nextjs (instalado mas não usado ainda no código)
- @supabase/supabase-js (instalado; ainda não inicializado)
- tailwindcss 4 (gerenciado via PostCSS config)

Estado real: é praticamente o template padrão gerado pelo `create-next-app` com Tailwind (landing default). Nenhuma rota protegida, nenhum provider do Clerk aplicado, nenhuma chamada Supabase.

---
## 2. Como o Next.js (App Router) Funciona

A pasta `app/` define tudo: páginas, layouts e APIs. Cada pasta vira um pedaço da URL. Um arquivo `page.tsx` é uma página. Um `layout.tsx` envolve páginas abaixo dele. Por padrão o código roda no servidor (isso reduz JS enviado ao navegador) e você só marca arquivos como client (`'use client'`) quando precisa hooks ou interatividade.

### 2.1 Conceitos-chave
| Conceito | Descrição rápida |
|----------|------------------|
| Rota | Qualquer pasta dentro de `app/` que contenha um `page.tsx` exporta uma página acessível pela URL correspondente. |
| Layout | Um `layout.tsx` em um nível de pasta envolve todas as páginas e layouts descendentes. Pode aninhar layouts. |
| Root Layout | `app/layout.tsx` obrigatório. Garante estrutura `<html><body>` e resets globais. |
| Server Component | (default) Roda no servidor, não inclui JS no bundle do cliente. Ideal para data fetching seguro. |
| Client Component | Marcado com `'use client'` no topo. Necessário quando usa estado, efeitos, hooks de navegação ou libs dependentes do DOM. |
| Route Handler | Arquivo `route.ts` dentro de pasta em `app/api/...` |
| Metadata | Export `metadata` ou `generateMetadata` para tags `<head>`. |
| Streaming / Suspense | Conteúdo pode ser enviado em partes do servidor. |
| Segmentos de rota | Nomes de pastas viram segmentos (`/dashboard`). Segmento dinâmico `[id]`, catch-all `[...slug]`, opcional `[[...slug]]`. |
| Grupos de rota | `(marketing)` - pasta com parênteses agrupa sem afetar a URL. Útil para separar áreas (ex: `(protected)`). |
| Parallel / Intercepted Routes | Avançado: permite múltiplos segmentos renderizados paralelamente ou interceptar navegação (não usado aqui). AUMENTA MUITO A COMPLEXIDADE!!|

### 2.2 Data Fetching (Com Exemplos)
Existem 4 ideias principais: buscar, cachear, revalidar e decidir onde roda (Node ou Edge).

1. Buscar direto no componente server (mais comum):
```tsx
// app/users/page.tsx
export const revalidate = 0; // sempre dinâmico (sem cache) – opcional

export default async function UsersPage() {
  const res = await fetch('https://api.example.com/users');
  const users: any[] = await res.json();
  return (
    <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
  );
}
```

2. Cache automático com revalidação por tempo (ISR):
```tsx
// Revalida a cada 60 segundos (toda requisição dentro da janela serve do cache)
export const revalidate = 60;

export default async function NewsPage() {
  const res = await fetch('https://api.example.com/news');
  const news = await res.json();
  return <pre>{JSON.stringify(news, null, 2)}</pre>;
}
```

3. Revalidação específica para uma chamada fetch (granular):
```tsx
export default async function MixedCachePage() {
  // Esta chamada é cacheada por 300s
  const cached = await fetch('https://api.example.com/cache-me', {
    next: { revalidate: 300 }
  }).then(r => r.json());

  // Esta é sempre dinâmica
  const dynamic = await fetch('https://api.example.com/live', { cache: 'no-store' })
    .then(r => r.json());

  return (
    <div>
      <h2>Cache 5 min</h2>
      <pre>{JSON.stringify(cached, null, 2)}</pre>
      <h2>Dinâmico</h2>
      <pre>{JSON.stringify(dynamic, null, 2)}</pre>
    </div>
  );
}
```

4. Forçar tudo dinâmico (sem qualquer cache):
```tsx
export const dynamic = 'force-dynamic';
```

5. Rodar no Edge (menor latência global):
```tsx
export const runtime = 'edge';
```

### Como funciona a Revalidação
Quando você usa `revalidate = 60` (ou `{ next: { revalidate: 60 } }`):
- A primeira requisição gera e armazena o HTML / dados.
- Requisições subsequentes dentro dos 60s recebem o cache (rápido).
- A primeira requisição após expirar o tempo dispara uma reconstrução em segundo plano (stale-while-revalidate). O usuário ainda vê a versão antiga, e a próxima já vê a nova.

Resumo rápido:
| Objetivo | O que usar |
|----------|------------|
| Sempre ao vivo | `revalidate = 0` ou `dynamic = 'force-dynamic'` ou `fetch(..., { cache: 'no-store' })` |
| Cache com tempo | `export const revalidate = N` |
| Mix granular | `fetch(url, { next: { revalidate: N }})` |
| Edge runtime | `export const runtime = 'edge'` |

### 2.3 Client vs Server Components
- Por padrão tudo em `app/` é server component.
- Adicione `'use client'` apenas onde precisa hooks (`useState`, `useEffect`, `useUser` do Clerk, etc.).
- Server components podem importar client components, mas o inverso não (porque client precisa saber de todas dependências no bundle).

### 2.4 Layouts Aninhados
Exemplo hipotético:
```
app/
  layout.tsx          (root)
  (marketing)/
    layout.tsx        (layout marketing)
    page.tsx          (/)
  (protected)/
    layout.tsx        (envolve páginas autenticadas)
    dashboard/
      page.tsx        (/dashboard)
```
O React compõe: RootLayout > ProtectedLayout > Page.

### 2.5 Estilização
- Tailwind carregado via `globals.css` importado no root layout.
- Fontes (Geist) configuradas em `layout.tsx` com a API de fontes do Next.

### 2.6 Build & Execução (e HMR)
- `next dev` -> modo desenvolvimento. Usa HMR (Hot Module Replacement): você salva o arquivo e o Next só recarrega o pedaço modificado em vez de recarregar a página inteira, preservando estado quando possível.
- `next build` -> compila tudo para produção: divide código, gera bundles server, edge e estáticos.
- `next start` -> serve o build otimizado.
- Edge / Node: cada arquivo pode declarar `export const runtime = 'edge'` se quiser rodar em Edge; caso contrário roda em Node.