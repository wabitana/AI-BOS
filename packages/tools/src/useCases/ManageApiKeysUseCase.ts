import { UseCase } from '@ai-bos/core';
import { IProviderConnectionRepository } from '../domain/IProviderConnectionRepository';
import { ProviderConnection } from '../domain/ProviderConnection';
import { encrypt, decrypt } from '../infrastructure/encryption';

// --- Save API Key ---

interface SaveApiKeyRequestDTO {
  organizationId: string;
  workspaceId?: string | null;
  providerName: string;
  apiKey: string;
}

interface SaveApiKeyResponseDTO {
  id: string;
  providerName: string;
  status: 'ACTIVE' | 'INVALID';
}

export class SaveApiKeyUseCase implements UseCase<SaveApiKeyRequestDTO, SaveApiKeyResponseDTO> {
  constructor(private repo: IProviderConnectionRepository) {}

  async execute(request: SaveApiKeyRequestDTO): Promise<SaveApiKeyResponseDTO> {
    const encryptedKey = encrypt(request.apiKey);

    // Check if a connection already exists for this provider
    const existing = await this.repo.findByProvider(
      request.organizationId,
      request.providerName,
      request.workspaceId,
    );

    if (existing) {
      // Update the existing connection
      existing.updateKey(encryptedKey);
      await this.repo.save(existing);
      return {
        id: existing.id.toString(),
        providerName: existing.providerName,
        status: existing.status,
      };
    }

    const connection = ProviderConnection.create({
      organizationId: request.organizationId,
      workspaceId: request.workspaceId ?? null,
      providerName: request.providerName,
      encryptedKey,
      status: 'ACTIVE',
    });

    await this.repo.save(connection);
    return {
      id: connection.id.toString(),
      providerName: connection.providerName,
      status: connection.status,
    };
  }
}

// --- Get Decrypted Key (internal use only) ---

interface GetApiKeyRequestDTO {
  organizationId: string;
  providerName: string;
  workspaceId?: string | null;
}

export class GetApiKeyUseCase implements UseCase<GetApiKeyRequestDTO, string | null> {
  constructor(private repo: IProviderConnectionRepository) {}

  async execute(request: GetApiKeyRequestDTO): Promise<string | null> {
    const connection = await this.repo.findByProvider(
      request.organizationId,
      request.providerName,
      request.workspaceId,
    );

    if (!connection || connection.status === 'INVALID') {
      return null;
    }

    return decrypt(connection.encryptedKey);
  }
}

// --- List Providers ---

interface ListProvidersRequestDTO {
  organizationId: string;
}

interface ProviderSummaryDTO {
  id: string;
  providerName: string;
  status: 'ACTIVE' | 'INVALID';
  workspaceId: string | null | undefined;
}

export class ListProvidersUseCase
  implements UseCase<ListProvidersRequestDTO, ProviderSummaryDTO[]>
{
  constructor(private repo: IProviderConnectionRepository) {}

  async execute(request: ListProvidersRequestDTO): Promise<ProviderSummaryDTO[]> {
    const connections = await this.repo.findAllByOrganization(request.organizationId);
    return connections.map((c) => ({
      id: c.id.toString(),
      providerName: c.providerName,
      status: c.status,
      workspaceId: c.workspaceId,
    }));
  }
}

// --- Delete Provider ---

interface DeleteProviderRequestDTO {
  id: string;
}

export class DeleteProviderUseCase implements UseCase<DeleteProviderRequestDTO, void> {
  constructor(private repo: IProviderConnectionRepository) {}

  async execute(request: DeleteProviderRequestDTO): Promise<void> {
    await this.repo.delete(request.id);
  }
}
