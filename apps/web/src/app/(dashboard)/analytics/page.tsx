import { BarChart3 } from 'lucide-react';

/**
 * Analytics overview page.
 */
export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor performance, usage, and ROI across your AI operations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Runs', value: '0', sub: 'All time' },
          { label: 'Avg. Latency', value: '—', sub: 'No data' },
          { label: 'Success Rate', value: '—', sub: 'No data' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-6"
          >
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <BarChart3 className="h-7 w-7 text-primary" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">No analytics data yet</h2>
          <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
            Run workflows and deploy agents to start seeing analytics.
          </p>
        </div>
      </div>
    </div>
  );
}
