import { prisma } from '@ai-bos/database';
import { getCurrentUser } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import { MessageSquare, Calendar, Bot } from 'lucide-react';
import Link from 'next/link';

export default async function ConversationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/sign-in');

  let conversations: any[] = [];
  if (process.env.DATABASE_URL) {
    const membership = await prisma.membership.findFirst({
      where: { userId: user.id },
      include: { organization: true },
    });

    if (membership) {
      conversations = await prisma.conversation.findMany({
        where: { organizationId: membership.organizationId },
        orderBy: { updatedAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          }
        },
      });
    }
  }

  return (
    <div className="space-y-8 p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Conversations</h1>
            <p className="mt-1 text-muted-foreground">
              View and manage agent interaction history.
            </p>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="space-y-4">
        {conversations.map((conv) => {
          const lastMessage = conv.messages[0];
          return (
            <div
              key={conv.id}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {conv.title || 'Untitled Conversation'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {conv.updatedAt.toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className={`font-medium ${conv.status === 'ACTIVE' ? 'text-green-500' : ''}`}>
                        {conv.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-sm text-primary hover:underline font-medium">
                  View Thread
                </button>
              </div>

              {lastMessage && (
                <div className="mt-4 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground border-l-2 border-primary/40">
                  <span className="font-semibold text-foreground mr-2 capitalize">
                    {lastMessage.role}:
                  </span>
                  <span className="line-clamp-2 inline">
                    {lastMessage.content}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground/50" />
            <h3 className="mt-4 font-medium text-foreground">No conversations yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Interactions with agents will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
