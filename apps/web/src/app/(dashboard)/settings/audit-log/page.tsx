import { ScrollText, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Audit Log page — paginated, filterable log of all organization actions.
 */
export default function AuditLogPage() {
  // Placeholder audit logs
  const logs = [
    { id: '1', action: 'member.invited', actor: 'John Doe', resource: 'Membership', time: '2 min ago', details: 'Invited jane@example.com as MEMBER' },
    { id: '2', action: 'workspace.created', actor: 'John Doe', resource: 'Workspace', time: '1 hour ago', details: 'Created workspace "Marketing"' },
    { id: '3', action: 'team.created', actor: 'Jane Smith', resource: 'Team', time: '3 hours ago', details: 'Created team "Engineering"' },
    { id: '4', action: 'organization.updated', actor: 'John Doe', resource: 'Organization', time: '1 day ago', details: 'Updated organization name' },
    { id: '5', action: 'member.role_updated', actor: 'John Doe', resource: 'Membership', time: '2 days ago', details: 'Changed Bob from MEMBER to ADMIN' },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ScrollText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Audit Log</h2>
            <p className="text-sm text-muted-foreground">Track all actions within your organization.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Actor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <tr key={log.id} className="transition-colors hover:bg-muted/20">
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-md bg-accent px-2.5 py-1 text-xs font-mono font-medium text-foreground">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                      {log.actor.charAt(0)}
                    </div>
                    <span className="text-sm text-foreground">{log.actor}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground max-w-[300px] truncate">
                  {log.details}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                  {log.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing 1-5 of 5 entries</p>
        <div className="flex items-center gap-2">
          <button
            disabled
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            className="flex h-9 items-center justify-center rounded-lg bg-primary/15 px-3 text-sm font-medium text-primary"
          >
            1
          </button>
          <button
            disabled
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
