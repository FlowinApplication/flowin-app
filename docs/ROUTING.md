# Flowin App - Fluxo de Rotas e Autenticação

Este documento descreve como as requisições navegam pelo sistema de rotas, middleware e autenticação.

## 1. Classificação Geral

| Tipo | Exemplo | Proteção | Tratamento Middleware |
|------|---------|----------|-----------------------|
| Página pública | `/` | Não exige login | Passa direto (NextResponse.next) |
| Página de login | `/sign-in/...` | Não exige login | Passa direto |
| Página de logout | `/logout` | (Client interativo) | Passa direto |
| API pública | `/api/public/test` | Aberta | Passa direto |
| API privada | `/api/private/test` | Exige login | Se sem sessão: 401 JSON |

Atualmente apenas rotas sob `/api/private(.*)` são protegidas pelo middleware.

## 2. Middleware

Arquivo: `src/middleware.ts`


<img src="./assets/Middleware%20Flow.png" alt="Fluxo do middleware protegendo rotas privadas" width="300" />
<figcaption style="margin-top:8px;font-size:12px;color:#666;">Figura 1 – Fluxo de decisão do middleware.</figcaption>

## 3. Fluxo de Requisição (Sequência API Privada)

Diagrama simplificado apenas com o essencial.

<div style="max-width:720px;margin:16px 0;">
  <img src="./assets/Request%20Flow.png" alt="Sequência de requisição para endpoint privado" style="width:100%;height:auto;border:1px solid #e5e7eb;border-radius:4px;" />
  <p style="margin:4px 0 0;font-size:12px;color:#666;text-align:center;">Figura 2 – Sequência simplificada da chamada /api/private/test.</p>
</div>

## 4. Fluxo Página Protegida (Já Implementado via `(auth)` + ProtectedLayout)
As páginas dentro do grupo de rota `(auth)` são embrulhadas por `ProtectedLayout`, que faz verificação client-side usando `useUser()`.

Etapas:
1. Request chega ao servidor e entrega HTML.
2. No cliente, `ProtectedLayout` aguarda `isLoaded`.
3. Se não autenticado: `router.replace(/sign-in?redirect_url=...)`.
4. Se autenticado: renderiza `children`.

<div style="max-width:720px;margin:16px 0;">
  <img src="./assets/Protected%20Page%20Flow.png" alt="Ciclo de carregamento e redirecionamento do ProtectedLayout" style="width:100%;height:auto;border:1px solid #e5e7eb;border-radius:4px;" />
  <p style="margin:4px 0 0;font-size:12px;color:#666;text-align:center;">Figura 3 – Fluxo client-side do ProtectedLayout.</p>
</div>

Observação: Este guard é client-side; conteúdo realmente sensível deve futuramente ser protegido também em nível server (middleware + layouts server components) se necessário.

## 5. Decisão de Proteção

Pseudocódigo simplificado do middleware:
```ts
const protected = ['/api/private(.*)'];
const match = pathname.startsWith('/api/private');
if (match && !userId) {
  if (pathname.startsWith('/api/')) return 401;
  else redirect('/sign-in?redirect_url=original');
}
```

## 6. Rota Privada
Arquivo: `src/app/api/private/test/route.ts`

- Chama `auth()` novamente (boa prática)
- Retorna 401 se `userId` ausente (mesmo após middleware)
- Resposta JSON com dados básicos da sessão

## 7. Rota Pública
Arquivo: `src/app/api/public/test/route.ts`

- Simples: retorna JSON sem checagem

## 8. Diagrama ASCII (Alternativo)

```
[Request]
  | matches matcher?
  |-- no --> serve static/next
  |-- yes --> clerkMiddleware
                 | auth() -> userId?
                 |  |-- rota privada? -- no --> next()
                 |  |-- rota privada? -- yes --> userId existe?
                 |                            |-- yes --> handler
                 |                            |-- no --> (API? 401 : redirect login)
```

## 9. Resumo
- `/api/private/*` protegido no middleware.
- Páginas em `(auth)` protegidas no cliente via `ProtectedLayout`.
- Public APIs ignoram autenticação.
- Middleware decide cedo entre continuar / retornar 401 / redirecionar.
- Handlers privados revalidam sessão (defesa extra).

## 10. ProtectedLayout (Frontend Guard)
Camada adicional no lado do cliente usada dentro do grupo de rotas `(auth)` (ou futuro `(protected)`).

Arquivo: `src/components/ProtectedLayout.tsx`

Função:
- Garante experiência imediata no cliente (spinner) enquanto `useUser()` carrega.
- Redireciona para `/sign-in?redirect_url=...` se o usuário não estiver autenticado após `isLoaded`.
- Complementa (não substitui) o middleware — ainda é possível bloquear acesso direto a APIs mesmo que o usuário burle o JS.

Quando usar:
- Para páginas que precisam de estado/hidratação client rápido.
- Enquanto você ainda não formalizou proteção server-side (middleware + layouts server).

Limitações:
- É client-side: a primeira resposta HTML ainda pode conter placeholders (não esconde conteúdo sensível que venha já renderizado do servidor).
- Não protege APIs (esse papel é do Middleware que vimos anteriormente).

Próxima evolução recomendada:
- Migrar páginas críticas para layout server `(private)/layout.tsx` que faça verificação no servidor.
- Reduzir dependência de `'use client'` onde não há interatividade.

Para tornar páginas também privadas, adicione o pattern e/ou um layout `(private)`.