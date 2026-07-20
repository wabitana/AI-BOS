import { prisma } from '@ai-bos/database';
import { getCurrentUser } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import { Network, History, CheckCircle2, XCircle, Clock, PauseCircle } from 'lucide-react';
import Link from 'next/link';

export default async function WorkflowHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/sign-in');

  const { id } = await params;

  let workflow: any = null;
  if (process.env.DATABASE_URL) {
    workflow = await prisma.workflow.findUnique({
      where: { id },
      include: {
        executions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });
  }

  if (!workflow) return <div>Workflow not found.</div>;

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/workflows"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            &larr;
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{workflow.name} - History</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Recent execution runs and their status.
            </p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Run ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Started At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {workflow.executions.map((exec) => {
              const started = exec.startedAt ? new Date(exec.startedAt) : new Date(exec.createdAt);
              const completed = exec.completedAt ? new Date(exec.completedAt) : new Date();
              const duration = Math.round((completed.getTime() - started.getTime()) / 1000);

              let StatusIcon = Clock;
              let statusColor = 'text-muted-foreground';
              
              if (exec.status === 'COMPLETED') {
                StatusIcon = CheckCircle2;
                statusColor = 'text-green-500';
              } else if (exec.status === 'FAILED') {
                StatusIcon = XCircle;
                statusColor = 'text-destructive';
              } else if (exec.status === 'PAUSED') {
                StatusIcon = PauseCircle;
                statusColor = 'text-yellow-500';
              } else if (exec.status === 'RUNNING') {
                statusColor = 'text-primary';
              }

              return (
                <tr key={exec.id} className="transition-colors hover:bg-muted/20">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-muted-foreground">
                      {exec.id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                      <span className={`text-sm font-medium ${statusColor}`}>
                        {exec.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {started.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {duration}s
                  </td>
                </tr>
              );
            })}
            {workflow.executions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-muted-foreground">
                  No executions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
