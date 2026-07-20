# AI-BOS Architecture

## Overview

AI-BOS is a multi-tenant AI-powered Business Operating System built as a monorepo using **Turborepo**, **pnpm workspaces**, and **Clean Architecture** principles.

## Repository Structure

```
ai-bos/
├── apps/
│   └── web/              # Next.js 15 App Router (frontend + API)
├── packages/
│   ├── core/             # Domain primitives (Entity, AggregateRoot, ValueObject)
│   ├── shared/           # Shared types, errors, validation schemas
│   ├── database/         # Prisma schema, client, migrations
│   ├── config/           # Shared ESLint/TS configs
│   ├── memory/           # Memory Engine (semantic memory, vector search)
│   ├── tools/            # Tool SDK (provider-independent tool registry)
│   ├── runtime/          # Agent Runtime (execution engine)
│   └── workflow/         # Workflow Engine (planner, scheduler, executor)
└── docs/                 # Documentation
```

## Architecture Layers

Each domain package follows **Clean Architecture**:

1. **Domain Layer** — Pure TypeScript entities, aggregate roots, value objects, and repository interfaces. No external dependencies.
2. **Application Layer** — Use cases that orchestrate domain logic. Accept repository interfaces via constructor injection.
3. **Infrastructure Layer** — Concrete implementations (Prisma repositories, API clients, LLM providers).

### Tool System Architecture

The `@ai-bos/tools` package defines the extensibility surface for agents:
- **`Tool`**: Core aggregate root representing a callable integration.
- **`ExecuteToolUseCase`**: Orchestrates tool execution, checks permissions, measures latency, and logs usage asynchronously.
- **`ManageApiKeysUseCase`**: Handles secure storage of API keys using AES-256-GCM encryption.

```
Agent Engine → ExecuteToolUseCase 
                ↓
           [Permission Check] 
                ↓
           [Tool Execution] → External API
                ↓
           [Async Usage Log] → Database
```

## Key Design Decisions

- **Multi-tenancy**: Organization → Workspace hierarchy. All data is scoped by `organizationId`.
- **RBAC**: Role-based access via `Membership.role` (OWNER, ADMIN, MANAGER, MEMBER, VIEWER).
- **Authentication**: NextAuth.js with Prisma Adapter.
- **State Management**: Zustand for client state, React Query for server state.
- **Styling**: Tailwind CSS v4 + shadcn/ui components.
- **Type Safety**: Strict TypeScript with `noEmit`, Zod for runtime validation. No `any`.

## Data Flow

```
User Action → Server Action / API Route → Use Case → Repository Interface → Prisma → PostgreSQL
```
