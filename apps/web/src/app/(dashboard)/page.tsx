import { BrainCircuit, Workflow, Wrench, BarChart3 } from 'lucide-react';

interface StatCard {
  readonly label: string;
  readonly value: string;
  readonly change: string;
  readonly icon: React.ElementType;
}

const STATS: readonly StatCard[] = [
  { label: 'Active Agents', value: '12', change: '+3 this week', icon: BrainCircuit },
  { label: 'Workflows Run', value: '1,284', change: '+18% vs last month', icon: Workflow },
  { label: 'Tools Connected', value: '24', change: '2 pending setup', icon: Wrench },
  { label: 'Tokens Used', value: '2.4M', change: '68% of quota', icon: BarChart3 },
] as const;

/**
 * Dashboard home page — displays platform overview statistics.
 * This is a React Server Component (default).
 */
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your AI Business Operating System.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-glow"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-3 text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>

              {/* Subtle gradient accent */}
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          );
        })}
      </div>

      {/* Recent Activity placeholder section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Workflow runs, agent actions, and system events will appear here.
        </p>
        <div className="mt-6 flex items-center justify-center rounded-lg border border-dashed border-border py-12">
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </div>
      </div>
    </div>
  );
}
