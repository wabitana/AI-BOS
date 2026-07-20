import { Repository } from '@ai-bos/core';
import { Workflow } from './Workflow';

/**
 * Repository contract for Workflow persistence.
 */
export interface IWorkflowRepository extends Repository<Workflow> {
  findByOrganizationId(organizationId: string): Promise<Workflow[]>;
  findByStatus(status: string): Promise<Workflow[]>;
}
