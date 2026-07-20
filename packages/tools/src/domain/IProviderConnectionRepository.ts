import { ProviderConnection } from '../domain/ProviderConnection';

/**
 * Port for persisting and retrieving provider connections (API keys).
 */
export interface IProviderConnectionRepository {
  save(connection: ProviderConnection): Promise<void>;
  findByProvider(
    organizationId: string,
    providerName: string,
    workspaceId?: string | null,
  ): Promise<ProviderConnection | null>;
  findAllByOrganization(organizationId: string): Promise<ProviderConnection[]>;
  delete(id: string): Promise<void>;
}
