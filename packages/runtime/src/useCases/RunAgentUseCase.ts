import { UseCase } from '@ai-bos/core';
import { IAgentRepository } from '../domain/IAgentRepository';

interface RunAgentRequestDTO {
  agentId: string;
  prompt: string;
}

type RunAgentResponseDTO = {
  response: string;
};

export class RunAgentUseCase implements UseCase<RunAgentRequestDTO, RunAgentResponseDTO> {
  constructor(private agentRepo: IAgentRepository) {}

  async execute(request: RunAgentRequestDTO): Promise<RunAgentResponseDTO> {
    const agent = await this.agentRepo.findById(request.agentId);
    
    if (!agent) {
      throw new Error(`Agent ${request.agentId} not found`);
    }

    return {
      response: `Agent ${agent.name} processed: "${request.prompt}" using model ${agent.model}`
    };
  }
}
