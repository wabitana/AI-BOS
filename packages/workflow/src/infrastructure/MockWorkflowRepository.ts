import { Workflow } from '../domain/Workflow';
import { IWorkflowRepository } from '../domain/IWorkflowRepository';
import { UniqueEntityID } from '@ai-bos/core';

export class MockWorkflowRepository implements IWorkflowRepository {
  private workflows: Workflow[] = [];

  async save(workflow: Workflow): Promise<void> {
    const exists = this.workflows.findIndex((w) => w.id.equals(workflow.id));
    if (exists >= 0) {
      this.workflows[exists] = workflow;
    } else {
      this.workflows.push(workflow);
    }
  }

  async findById(id: string): Promise<Workflow | null> {
    const workflow = this.workflows.find((w) => w.id.toValue() === id);
    return workflow || null;
  }

  async delete(id: string): Promise<void> {
    this.workflows = this.workflows.filter((w) => w.id.toValue() !== id);
  }

  async findByOrganizationId(organizationId: string): Promise<Workflow[]> {
    return this.workflows.filter((w) => w.props.organizationId === organizationId);
  }

  async findByStatus(status: string): Promise<Workflow[]> {
    return this.workflows.filter((w) => w.status === status);
  }
}
