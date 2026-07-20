import { Shield, Plus, MoreHorizontal, Users as UsersIcon } from 'lucide-react';

/**
 * Teams settings page — manage organization teams.
 */
export default function TeamsPage() {
  // Placeholder teams for UI scaffolding
  const teams = [
    { id: '1', name: 'Engineering', description: 'Core platform development', memberCount: 5 },
    { id: '2', name: 'Content', description: 'Content creation and management', memberCount: 3 },
    { id: '3', name: 'Marketing', description: 'Growth and analytics', memberCount: 2 },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Teams</h2>
            <p className="text-sm text-muted-foreground">Organize members into teams for access control.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110">
          <Plus className="h-4 w-4" />
          Create Team
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <div
            key={team.id}
            className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-glow"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <Shield className="h-5 w-5" />
              </div>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-accent hover:text-foreground"
                aria-label="Team options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            <h3 className="mt-4 font-semibold text-foreground">{team.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{team.description}</p>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <UsersIcon className="h-3.5 w-3.5" />
              <span>{team.memberCount} members</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
