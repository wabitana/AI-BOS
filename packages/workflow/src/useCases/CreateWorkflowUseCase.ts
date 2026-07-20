import { UseCase } from '@ai-bos/core';
import { IWorkflowRepository } from '../domain/IWorkflowRepository';
import { Workflow } from '../domain/Workflow';

export interface CreateWorkflowRequest {
  organizationId: string;
  name: string;
  description: string;
  workspaceId?: string;
}

export interface CreateWorkflowResponse {
  workflowId: string;
}

/**
 * Application Use Case to create a new empty Workflow.
 */
export class CreateWorkflowUseCase implements UseCase<CreateWorkflowRequest, CreateWorkflowResponse> {
  constructor(private readonly workflowRepo: IWorkflowRepository) {}

  async execute(request: CreateWorkflowRequest): Promise<CreateWorkflowResponse> {
    const workflow = Workflow.create({
      organizationId: request.organizationId,
      name: request.name,
      description: request.description,
      workspaceId: request.workspaceId,
      status: 'DRAFT',
      tasks: [],
    });

    await this.workflowRepo.save(workflow);

    return {
      workflowId: workflow.id.toValue(),
    };
  }
}
