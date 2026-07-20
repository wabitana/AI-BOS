export interface IVectorStore {
  saveEmbedding(id: string, text: string, metadata?: Record<string, any>): Promise<void>;
  search(query: string, topK?: number, filter?: Record<string, any>): Promise<Array<{ id: string, score: number, metadata?: Record<string, any> }>>;
}

/**
 * Mock implementation of a vector store for MVP. 
 * Instead of computing actual embeddings (e.g. via OpenAI) and using pgvector/Pinecone,
 * this just simulates a vector search using basic text matching to avoid requiring
 * local database extensions like pgvector during initial setup.
 */
export class InMemoryVectorStore implements IVectorStore {
  // In a real app, you would pass in a Prisma client or Pinecone client
  constructor(private dbClient: any) {}

  async saveEmbedding(id: string, text: string, metadata?: Record<string, any>): Promise<void> {
    // We assume the Memory row was already saved in Prisma. 
    // If this were Pinecone or pgvector, we would call an LLM to embed `text` and store the float array here.
    console.log(`[InMemoryVectorStore] Saved mock embedding for ID: ${id}`);
  }

  async search(query: string, topK: number = 3, filter?: Record<string, any>): Promise<Array<{ id: string, score: number, metadata?: Record<string, any> }>> {
    // Mock semantic search: just find memories in DB that contain any of the query words
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    
    // Naive fallback if query has no long words
    if (words.length === 0) {
      const all = await this.dbClient.memory.findMany({ 
        where: filter ? filter : undefined,
        take: topK 
      });
      return all.map((m: any) => ({ id: m.id, score: 0.5, metadata: m }));
    }

    // A real implementation would do:
    // const embedding = await createEmbedding(query);
    // return dbClient.$queryRaw`SELECT id, 1 - (embedding <=> ${embedding}) as score FROM Memory ORDER BY score DESC LIMIT ${topK}`;

    // Mock implementation using basic filtering
    const results = await this.dbClient.memory.findMany({
      where: {
        ...(filter || {}),
      },
    });

    const scored = results.map((m: any) => {
      let score = 0;
      const content = (m.content + ' ' + m.title).toLowerCase();
      words.forEach(w => {
        if (content.includes(w)) score += 0.2;
      });
      return { id: m.id, score, metadata: m };
    });

    return scored
      .filter((s: any) => s.score > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, topK);
  }
}
