import { prisma } from '@ai-bos/database';
import { getCurrentUser } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import { BrainCircuit, Plus, MoreHorizontal, Settings, Activity } from 'lucide-react';
import Link from 'next/link';

export default async function AgentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/sign-in');

  // Skip DB queries when no database is configured
  let agents: any[] = [];
  if (process.env.DATABASE_URL) {
    const membership = await prisma.membership.findFirst({
      where: { userId: user.id },
      include: { organization: true },
    });

    if (membership) {
      agents = await prisma.agent.findMany({
        where: { organizationId: membership.organizationId },
        orderBy: { updatedAt: 'desc' },
        include: {
          executions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });
    }
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Agents</h1>
            <p className="mt-1 text-muted-foreground">
              Deploy and manage intelligent AI agents for your workflows.
            </p>
          </div>
        </div>
        <Link
          href="/agents/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          New Agent
        </Link>
      </div>

      {/* Agents List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => {
          const lastExec = agent.executions[0];
          return (
            <div
              key={agent.id}
              className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-glow"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                    agent.status === 'ACTIVE'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {agent.status}
                </div>
                <button className="text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-4 flex-1">
                <Link href={`/agents/${agent.id}`} className="block">
                  <h3 className="font-semibold text-foreground hover:underline">
                    {agent.name}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {agent.description || 'No description provided.'}
                </p>
                <div className="mt-2 text-xs text-muted-foreground">
                  Type: {agent.type}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Activity className="h-3.5 w-3.5" />
                  {lastExec ? (
                    <span className="truncate max-w-[120px]">
                      Last run: {lastExec.status}
                    </span>
                  ) : (
                    <span>Never run</span>
                  )}
                </div>
                <Link
                  href={`/agents/${agent.id}`}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:brightness-110"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Configure
                </Link>
              </div>
            </div>
          );
        })}
        {agents.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
            <BrainCircuit className="h-10 w-10 text-muted-foreground/50" />
            <h3 className="mt-4 font-medium text-foreground">No agents yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first agent to handle specialized tasks.
            </p>
            <Link
              href="/agents/new"
              className="mt-6 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              New Agent
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
