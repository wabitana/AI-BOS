import { IToolRegistry } from '../domain/IToolRegistry';
import { Tool } from '../domain/Tool';
import { ToolCategory } from '../domain/Category';

export class MockToolRegistry implements IToolRegistry {
  private tools: Map<string, Tool> = new Map();

  async register(tool: Tool): Promise<void> {
    this.tools.set(tool.name, tool);
  }

  async getTool(name: string): Promise<Tool | null> {
    return this.tools.get(name) || null;
  }

  async listTools(): Promise<Tool[]> {
    return Array.from(this.tools.values());
  }

  async getToolsByCategory(category: ToolCategory): Promise<Tool[]> {
    return Array.from(this.tools.values()).filter(tool => tool.category === category);
  }
}
