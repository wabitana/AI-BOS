import { FolderOpen, Plus, MoreHorizontal, Clock } from 'lucide-react';

/**
 * Workspaces settings page — list and manage workspaces.
 */
export default function WorkspacesPage() {
  // Placeholder workspaces for UI scaffolding
  const workspaces = [
    { id: '1', name: 'Default', description: 'Main workspace', createdAt: '2 days ago' },
    { id: '2', name: 'Marketing Campaigns', description: 'Q3 marketing initiatives', createdAt: '1 day ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FolderOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Workspaces</h2>
            <p className="text-sm text-muted-foreground">Isolated project spaces within your organization.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110">
          <Plus className="h-4 w-4" />
          Create Workspace
        </button>
      </div>

      {/* Workspaces Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Workspace
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Created
              </th>
              <th className="w-12 px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {workspaces.map((ws) => (
              <tr key={ws.id} className="transition-colors hover:bg-muted/20">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-muted-foreground">
                      <FolderOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{ws.name}</p>
                      <p className="text-xs text-muted-foreground">{ws.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {ws.createdAt}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label="Workspace options"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
