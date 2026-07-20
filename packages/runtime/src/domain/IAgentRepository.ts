import { Agent } from './Agent';

export interface IAgentRepository {
  findById(id: string): Promise<Agent | null>;
  save(agent: Agent): Promise<void>;
}
