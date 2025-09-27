<div align="center">
	<h1>Flowin App</h1>
	<p><strong>Rastreador simples de atividades diárias</strong> – foco em hábitos, tarefas e evolução pessoal.</p>
	<sup>Estado inicial do projeto – arquitetura e autenticação ainda em construção.</sup>
</div>

---

## ✨ Objetivo
Criar uma aplicação moderna (Next.js + Edge) para organizar e acompanhar atividades/hábitos, com autenticação centralizada e backend simples usando Supabase.

## 🧱 Stack Principal
| Área | Tecnologia | Status |
|------|------------|--------|
| Frontend | Next.js (App Router, Edge) | Base criada |
| UI | React 19 + Tailwind CSS 4 | OK |
| Auth | Clerk | A configurar |
| Banco | Supabase (PostgreSQL) | A configurar |
| Docs Arquitetura | `/docs/ARCHITECTURE.md` | Em evolução |
| Docs Routing | `/docs/ROUTING.md` | Em evolução |
| Design / Inspiração | Figma / Lovable / v0 | Em uso esporádico |

## 📂 Estrutura (simplificada)
```
src/
	app/
		layout.tsx        # Root layout
		page.tsx          # Landing inicial (template)
		(auth)/           # Grupo de rotas protegidas (client guard)
			layout.tsx      # Usa ProtectedLayout
			home/page.tsx   # Página autenticada exemplo
docs/
	ARCHITECTURE.md     # Documento detalhado de arquitetura
	ROUTING.MD			# Documento detalhado de roteamento
```

Mais detalhes: ver `docs/ARCHITECTURE.md`.

## 🚀 Como Rodar Localmente
Pré-requisitos: Node 18+ (ou 20+), pnpm ou npm.

```powershell
# Instalar deps
pnpm install   # ou npm install

# Rodar em dev
pnpm dev       # ou npm run dev

# Build produção
pnpm build
pnpm start
```

## 🔐 Variáveis de Ambiente (planejado)
Criar `.env.local` (não commitar):
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx

NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # uso apenas server-side
```

## 🛣️ Roadmap Inicial
- [x] Configurar Clerk (`ClerkProvider`, rotas /sign-in /sign-up)
- [x] Layout protegido server `(auth)/layout.tsx`
- [ ] Integração Supabase (client + tabela profiles)
- [ ] Sincronizar usuário (webhook Clerk -> profile)
- [ ] Criar modelo de atividade/hábito
- [ ] CRUD básico de atividades
- [ ] Métricas simples (streak, contagem semanal)
- [ ] Testes básicos (Playwright ou Vitest)
- [ ] Deploy Vercel + variáveis em produção

## 🏗️ Decisões de Arquitetura (resumo)
Resumo enxuto; versão completa em `docs/ARCHITECTURE.md`.
| Tema | Decisão Atual | Observação |
|------|---------------|------------|
| Roteamento | App Router | Facilita layouts e data fetching server-side |
| Auth | Clerk (client + middleware futuro) | Simplicidade + UI pronta |
| Banco | Supabase Postgres | RLS futura para isolar dados do usuário |
| Estilo | Tailwind | Produtividade + design system leve |
| Execução | Edge onde fizer sentido | Evitar libs Node-only onde marcar edge |

## 🔄 Fluxo de Desenvolvimento Sugerido
1. Implementar auth básica (provider + páginas).
2. Criar layout protegido + primeira rota autenticada.
3. Modelar tabela `profiles` no Supabase.
4. Definir RLS inicial e política de acesso.
5. Criar entidades de atividades + APIs/Server Actions.
6. Adicionar testes e lint mais rígido.

## 🤝 Contribuindo
1. Crie branch feature: `feat/nome-curto`.
2. Commits semânticos: `feat:`, `fix:`, `chore:`, `docs:`.
3. Abra PR descrevendo motivação + screenshot (se UI).

## 🧪 Scripts (package.json)
| Script | Descrição |
|--------|-----------|
| `dev` | Ambiente de desenvolvimento |
| `build` | Build produção |
| `start` | Servir build |
| `lint` | Executar ESLint |

## 🗺️ Referências Rápidas
- Next.js App Router: https://nextjs.org/docs/app
- Clerk: https://clerk.com/docs
- Supabase: https://supabase.com/docs
- Tailwind: https://tailwindcss.com

## 📄 Licença
Definir (MIT recomendada) – ainda não especificada.

---
Mantido por Flowin-org. Para detalhes avançados leia `docs/ARCHITECTURE.md`.
