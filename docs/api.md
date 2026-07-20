# AI-BOS API Reference

## Overview

AI-BOS uses **Next.js Server Actions** as the primary API layer. Route Handlers (`app/api/`) are used only where Server Actions are insufficient (webhooks, external integrations).

## Authentication

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth.js authentication routes |

## Server Actions

### Organizations

| Action | Module | Description |
|---|---|---|
| `createOrganization` | `actions/organizations` | Create a new organization |
| `updateOrganization` | `actions/organizations` | Update organization details |
| `deleteOrganization` | `actions/organizations` | Soft-delete an organization |

### Workspaces

| Action | Module | Description |
|---|---|---|
| `createWorkspace` | `actions/workspaces` | Create workspace within an org |
| `updateWorkspace` | `actions/workspaces` | Update workspace details |

### Teams

| Action | Module | Description |
|---|---|---|
| `createTeam` | `actions/teams` | Create team within an org |
| `addTeamMember` | `actions/teams` | Add user to team |
| `removeTeamMember` | `actions/teams` | Remove user from team |

### Members

| Action | Module | Description |
|---|---|---|
| `inviteMember` | `actions/members` | Invite user to organization |
| `updateMemberRole` | `actions/members` | Change member role |
| `removeMember` | `actions/members` | Remove member from organization |

*This document is updated as new modules are implemented.*
