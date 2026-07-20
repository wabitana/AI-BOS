import type { Conversation, Message } from '@ai-bos/database';

export class ConversationManager {
  constructor(private dbClient: any) {}

  /**
   * Starts a new conversation.
   */
  async startConversation(organizationId: string, workspaceId?: string, title?: string): Promise<Conversation> {
    return this.dbClient.conversation.create({
      data: {
        organizationId,
        workspaceId,
        title: title || 'New Conversation',
      }
    });
  }

  /**
   * Appends a message to the conversation.
   */
  async addMessage(conversationId: string, role: 'user' | 'assistant' | 'system', content: string, tokensUsed: number = 0): Promise<Message> {
    return this.dbClient.message.create({
      data: {
        conversationId,
        role,
        content,
        tokensUsed
      }
    });
  }

  /**
   * Retrieves the conversation history, optionally limiting to the last N messages to fit token limits.
   */
  async getHistory(conversationId: string, limit: number = 50): Promise<Message[]> {
    return this.dbClient.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' }, // Get chronological order
      take: -limit // Take the last `limit` messages
    });
  }

  /**
   * Summarizes older messages to compress context (Mock implementation)
   */
  async compressHistory(conversationId: string): Promise<string> {
    const messages = await this.dbClient.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
    
    // In a real implementation, you would send the `messages` array to an LLM to generate a summary.
    // For now, we mock the response.
    return `Summarized context of ${messages.length} previous messages.`;
  }
}
