# AI-BOS Database Schema

## Provider

- **PostgreSQL** via Prisma ORM
- Schema location: `packages/database/prisma/schema.prisma`

## Models

### Authentication (NextAuth.js)

| Model | Purpose |
|---|---|
| `User` | Core user identity. Linked to accounts, sessions, memberships. |
| `Account` | OAuth provider accounts (Google, GitHub, etc.) |
| `Session` | Active user sessions |
| `VerificationToken` | Email verification / magic link tokens |

### Multi-Tenancy

| Model | Purpose |
|---|---|
| `Organization` | Top-level tenant. Has workspaces, teams, memberships. |
| `Membership` | Links a User to an Organization with a role (OWNER, ADMIN, MANAGER, MEMBER, VIEWER). |
| `Workspace` | Isolated project space within an Organization. |
| `Team` | Named group of users within an Organization. |
| `TeamMember` | Links a User to a Team with a team-level role. |

### Settings

| Model | Purpose |
|---|---|
| `OrganizationSettings` | Org-level branding, billing email, feature flags. One-to-one with Organization. |
| `WorkspaceSettings` | Workspace-level defaults and integrations. One-to-one with Workspace. |

### Audit & Notifications

| Model | Purpose |
|---|---|
| `AuditLog` | Immutable record of actions (actor, action, resource, metadata). Scoped to org/workspace. |
| `Notification` | User-targeted notification with read status and optional link. |

### Memory

| Model | Purpose |
|---|---|
| `Memory` | Semantic memory entries: documents, brand guidelines, campaign results, etc. |

## Relationships

```
User 1──N Account
User 1──N Session
User 1──N Membership N──1 Organization
User 1──N TeamMember N──1 Team N──1 Organization
Organization 1──N Workspace
Organization 1──1 OrganizationSettings
Workspace 1──1 WorkspaceSettings
Organization 1──N AuditLog
User 1──N Notification
```
