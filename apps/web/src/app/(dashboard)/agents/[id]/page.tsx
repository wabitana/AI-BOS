import { prisma } from '@ai-bos/database';
import { getCurrentUser } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import { BrainCircuit, ArrowLeft, Settings, History, Activity } from 'lucide-react';
import Link from 'next/link';

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect('/auth/sign-in');

  let agent: any = null;
  if (process.env.DATABASE_URL) {
    const membership = await prisma.membership.findFirst({
      where: { userId: user.id },
      include: { organization: true },
    });

    if (membership) {
      agent = await prisma.agent.findUnique({
        where: { id, organizationId: membership.organizationId },
        include: {
          versions: {
            orderBy: { version: 'desc' },
          },
          executions: {
            orderBy: { createdAt: 'desc' },
            take: 50,
          }
        },
      });
    }
  }

  if (!agent) {
    return <div>Agent not found.</div>;
  }

  const currentVersion = agent.versions[0];

  return (
    <div className="space-y-8 p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/agents"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{agent.name}</h1>
            <p className="mt-1 text-muted-foreground">
              {agent.description || 'No description provided.'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs / Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Config Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Configuration</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">System Prompt</label>
                <textarea 
                  className="w-full h-48 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  defaultValue={currentVersion?.systemPrompt || ''}
                  placeholder="You are a helpful AI agent..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Assigned Tools</label>
                <div className="flex flex-wrap gap-2">
                  {currentVersion?.tools && currentVersion.tools.length > 0 ? (
                    currentVersion.tools.map((toolId) => (
                      <span key={toolId} className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                        {toolId}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">No tools assigned</span>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-glow">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Stats */}
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Activity Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="text-sm font-medium">{agent.type}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Total Runs</span>
                <span className="text-sm font-medium">{agent.executions.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Latest Version</span>
                <span className="text-sm font-medium">v{currentVersion?.version || 1}</span>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <History className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Recent Executions</h3>
            </div>
            <div className="space-y-4">
              {agent.executions.slice(0, 5).map((exec) => (
                <div key={exec.id} className="flex flex-col gap-1 border-l-2 border-primary/40 pl-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {exec.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {exec.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{exec.tokensUsed} tokens</span>
                    <span>${exec.cost.toFixed(4)}</span>
                  </div>
                </div>
              ))}
              {agent.executions.length === 0 && (
                <div className="text-sm text-muted-foreground italic text-center py-4">
                  No executions yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
