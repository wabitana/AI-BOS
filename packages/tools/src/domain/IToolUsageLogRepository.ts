import { ToolUsageLog } from '../domain/ToolUsageLog';

/**
 * Port for persisting tool usage logs.
 */
export interface IToolUsageLogRepository {
  save(log: ToolUsageLog): Promise<void>;
  findByOrganization(
    organizationId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<ToolUsageLog[]>;
  countByOrganization(organizationId: string): Promise<number>;
}
