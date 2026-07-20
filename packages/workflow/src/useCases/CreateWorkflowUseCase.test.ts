import { describe, it, expect, beforeEach } from 'vitest';
import { CreateWorkflowUseCase } from './CreateWorkflowUseCase';
import { MockWorkflowRepository } from '../infrastructure/MockWorkflowRepository';

describe('CreateWorkflowUseCase', () => {
  let repo: MockWorkflowRepository;
  let useCase: CreateWorkflowUseCase;

  beforeEach(() => {
    repo = new MockWorkflowRepository();
    useCase = new CreateWorkflowUseCase(repo);
  });

  it('should create a draft workflow', async () => {
    const response = await useCase.execute({
      organizationId: 'org-1',
      name: 'Test Workflow',
      description: 'A workflow for testing',
    });

    expect(response.workflowId).toBeDefined();

    const savedWorkflow = await repo.findById(response.workflowId);
    expect(savedWorkflow).not.toBeNull();
    expect(savedWorkflow?.name).toBe('Test Workflow');
    expect(savedWorkflow?.status).toBe('DRAFT');
    expect(savedWorkflow?.tasks.length).toBe(0);
  });
});
