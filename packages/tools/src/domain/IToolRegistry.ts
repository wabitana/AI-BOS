import { Tool } from './Tool';
import { ToolCategory } from './Category';

export interface IToolRegistry {
  register(tool: Tool): Promise<void>;
  getTool(name: string): Promise<Tool | null>;
  listTools(): Promise<Tool[]>;
  getToolsByCategory(category: ToolCategory): Promise<Tool[]>;
}
