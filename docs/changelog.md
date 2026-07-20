# AI-BOS Changelog

## [Unreleased] — Phase 1: Platform Core

### Added
- **Database Schema**: NextAuth models (User, Account, Session, VerificationToken), Team, TeamMember, OrganizationSettings, WorkspaceSettings, AuditLog, Notification.
- **Documentation**: Created `docs/` directory with `architecture.md`, `database.md`, `api.md`, `agents.md`, `changelog.md`.

---

## [0.1.0] — Phase 0: Project Foundation

### Added
- Monorepo scaffold with Turborepo + pnpm workspaces.
- `@ai-bos/core`: Domain primitives (Entity, AggregateRoot, UniqueEntityID, Repository, UseCase).
- `@ai-bos/shared`: AppError base class with typed error categories.
- `@ai-bos/database`: Prisma schema with User, Organization, Membership, Workspace, Memory.
- `@ai-bos/memory`: Memory domain entity, IMemoryRepository, SaveMemoryUseCase.
- `@ai-bos/tools`: Tool domain, IToolRegistry, ExecuteToolUseCase.
- `@ai-bos/runtime`: Agent domain, RunAgentUseCase.
- `@ai-bos/workflow`: Workflow & WorkflowTask entities, IPlanner/IScheduler/IExecutor/IEvaluator interfaces, CreateWorkflowUseCase.
- `@ai-bos/web`: Next.js 15 app with Tailwind CSS v4, Zustand, React Query.
