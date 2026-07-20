import { prisma } from '@ai-bos/database';
import { getCurrentUser } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import { Database, Plus, Search, Tag } from 'lucide-react';
import Link from 'next/link';

export default async function MemoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/sign-in');

  let memories: any[] = [];
  if (process.env.DATABASE_URL) {
    const membership = await prisma.membership.findFirst({
      where: { userId: user.id },
      include: { organization: true },
    });

    if (membership) {
      memories = await prisma.memory.findMany({
        where: { organizationId: membership.organizationId },
        orderBy: { createdAt: 'desc' },
      });
    }
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Semantic Memory</h1>
            <p className="mt-1 text-muted-foreground">
              Manage knowledge documents, brand guidelines, and vectorized context for your agents.
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110">
          <Plus className="h-4 w-4" />
          Add Knowledge
        </button>
      </div>

      {/* Memory List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {memories.map((memory) => (
          <div
            key={memory.id}
            className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-glow"
          >
            <div className="flex items-start justify-between">
              <div className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground uppercase tracking-wider">
                {memory.type}
              </div>
            </div>
            
            <div className="mt-4 flex-1">
              <h3 className="font-semibold text-foreground">
                {memory.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                {memory.content}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 flex-wrap border-t border-border pt-4">
              {memory.tags.length > 0 ? (
                memory.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">No tags</span>
              )}
            </div>
          </div>
        ))}

        {memories.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
            <Search className="h-10 w-10 text-muted-foreground/50" />
            <h3 className="mt-4 font-medium text-foreground">No knowledge base entries</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add documents to provide semantic context for your AI agents.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
