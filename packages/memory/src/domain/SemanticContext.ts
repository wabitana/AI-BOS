import { IVectorStore } from '../infrastructure/VectorStore';

export class SemanticContext {
  constructor(private vectorStore: IVectorStore) {}

  /**
   * Retrieves relevant context for an agent based on their input query and organization scope.
   */
  async retrieveContextForQuery(query: string, organizationId: string, workspaceId?: string, topK: number = 3): Promise<string> {
    const filter: any = { organizationId };
    if (workspaceId) {
      filter.workspaceId = workspaceId;
    }

    const results = await this.vectorStore.search(query, topK, filter);

    if (results.length === 0) {
      return "No relevant context found in semantic memory.";
    }

    // Format the retrieved memory items into a string for the LLM prompt
    const formattedContext = results.map((res, index) => {
      const mem = res.metadata;
      if (!mem) return '';
      return `[Context Item ${index + 1}]
Title: ${mem.title}
Type: ${mem.type}
Content: ${mem.content}
Relevance Score: ${res.score.toFixed(2)}`;
    }).join('\n\n');

    return `Relevant Semantic Knowledge:\n${formattedContext}`;
  }

  /**
   * Helper to format a system prompt with injected semantic context.
   */
  async injectContextIntoPrompt(systemPrompt: string, query: string, organizationId: string, workspaceId?: string): Promise<string> {
    const context = await this.retrieveContextForQuery(query, organizationId, workspaceId);
    return `${systemPrompt}\n\n${context}`;
  }
}
