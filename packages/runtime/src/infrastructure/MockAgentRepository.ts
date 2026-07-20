import { IAgentRepository } from '../domain/IAgentRepository';
import { Agent } from '../domain/Agent';

export class MockAgentRepository implements IAgentRepository {
  private agents: Map<string, Agent> = new Map();

  async findById(id: string): Promise<Agent | null> {
    return this.agents.get(id) || null;
  }

  async save(agent: Agent): Promise<void> {
    this.agents.set(agent.id.toString(), agent);
  }
}
