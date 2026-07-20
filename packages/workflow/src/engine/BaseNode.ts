export interface WorkflowContext {
  variables: Record<string, any>;
  results: Record<string, any>;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PAUSED';
}

export interface NodeExecutionResult {
  status: 'COMPLETED' | 'FAILED' | 'PAUSED';
  output?: Record<string, any>;
  error?: string;
  nextNodeIds?: string[]; // Used for branching logic (e.g. Condition Node)
}

export abstract class BaseNode {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly name: string,
    public readonly config: Record<string, any>
  ) {}

  abstract execute(context: WorkflowContext): Promise<NodeExecutionResult>;
}
