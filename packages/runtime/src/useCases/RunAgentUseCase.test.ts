import { describe, it, expect, beforeEach } from 'vitest';
import { RunAgentUseCase } from './RunAgentUseCase';
import { MockAgentRepository } from '../infrastructure/MockAgentRepository';
import { Agent } from '../domain/Agent';

describe('RunAgentUseCase', () => {
  let agentRepo: MockAgentRepository;
  let runAgentUseCase: RunAgentUseCase;

  beforeEach(() => {
    agentRepo = new MockAgentRepository();
    runAgentUseCase = new RunAgentUseCase(agentRepo);
  });

  it('should successfully run an agent and return a mocked response', async () => {
    const agent = Agent.create({
      name: 'SalesBot',
      systemPrompt: 'You are a helpful sales assistant.',
      model: 'gpt-4o',
      workspaceId: 'ws-123'
    });

    await agentRepo.save(agent);

    const result = await runAgentUseCase.execute({
      agentId: agent.id.toString(),
      prompt: 'Hello!'
    });

    expect(result.response).toBe(`Agent SalesBot processed: "Hello!" using model gpt-4o`);
  });

  it('should throw an error if agent does not exist', async () => {
    await expect(runAgentUseCase.execute({
      agentId: 'non-existent-id',
      prompt: 'Hello!'
    })).rejects.toThrow('Agent non-existent-id not found');
  });
});
