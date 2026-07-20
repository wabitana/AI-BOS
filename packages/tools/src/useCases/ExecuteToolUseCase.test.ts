import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExecuteToolUseCase } from './ExecuteToolUseCase';
import { MockToolRegistry } from '../infrastructure/MockToolRegistry';
import { Tool } from '../domain/Tool';
import { ToolCategory } from '../domain/Category';
import type { IToolPermissionChecker } from '../domain/IToolPermissionChecker';
import type { IToolUsageLogRepository } from '../domain/IToolUsageLogRepository';

function createDummyTool(name = 'add') {
  return Tool.create({
    name,
    description: 'Adds two numbers',
    category: ToolCategory.LLM,
    schema: { type: 'object', properties: { a: { type: 'number' }, b: { type: 'number' } } },
    execute: async (args: { a: number; b: number }) => args.a + args.b,
  });
}

describe('ExecuteToolUseCase', () => {
  let toolRegistry: MockToolRegistry;

  beforeEach(() => {
    toolRegistry = new MockToolRegistry();
  });

  it('should successfully execute a registered tool (legacy constructor)', async () => {
    const executeToolUseCase = new ExecuteToolUseCase(toolRegistry);
    await toolRegistry.register(createDummyTool());

    const response = await executeToolUseCase.execute({
      toolName: 'add',
      args: { a: 5, b: 3 },
    });

    expect(response.result).toBe(8);
    expect(response.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('should throw an error if tool does not exist', async () => {
    const executeToolUseCase = new ExecuteToolUseCase(toolRegistry);

    await expect(
      executeToolUseCase.execute({ toolName: 'nonExistentTool', args: {} })
    ).rejects.toThrow('Tool nonExistentTool not found');
  });

  it('should deny execution when permission checker rejects', async () => {
    const permissionChecker: IToolPermissionChecker = {
      isAllowed: vi.fn().mockResolvedValue(false),
    };

    const useCase = new ExecuteToolUseCase({
      toolRegistry,
      permissionChecker,
    });

    await toolRegistry.register(createDummyTool());

    await expect(
      useCase.execute({
        toolName: 'add',
        args: { a: 1, b: 2 },
        context: { organizationId: 'org-1', workspaceId: 'ws-1' },
      })
    ).rejects.toThrow('Permission denied');
  });

  it('should allow execution when permission checker approves', async () => {
    const permissionChecker: IToolPermissionChecker = {
      isAllowed: vi.fn().mockResolvedValue(true),
    };

    const useCase = new ExecuteToolUseCase({
      toolRegistry,
      permissionChecker,
    });

    await toolRegistry.register(createDummyTool());

    const response = await useCase.execute({
      toolName: 'add',
      args: { a: 10, b: 20 },
      context: { organizationId: 'org-1', workspaceId: 'ws-1' },
    });

    expect(response.result).toBe(30);
  });

  it('should log usage when a repository is provided', async () => {
    const saveMock = vi.fn().mockResolvedValue(undefined);
    const usageLogRepository: IToolUsageLogRepository = {
      save: saveMock,
      findByOrganization: vi.fn(),
      countByOrganization: vi.fn(),
    };

    const useCase = new ExecuteToolUseCase({
      toolRegistry,
      usageLogRepository,
    });

    await toolRegistry.register(createDummyTool());

    await useCase.execute({
      toolName: 'add',
      args: { a: 1, b: 1 },
      context: { organizationId: 'org-1' },
    });

    // Give the fire-and-forget save a tick to resolve
    await new Promise((r) => setTimeout(r, 10));

    expect(saveMock).toHaveBeenCalledOnce();
  });
});

