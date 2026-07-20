import { BaseNode, NodeExecutionResult, WorkflowContext } from '../BaseNode';

export class VariableNode extends BaseNode {
  constructor(id: string, name: string, config: Record<string, any>) {
    super(id, 'VARIABLE', name, config);
  }

  async execute(context: WorkflowContext): Promise<NodeExecutionResult> {
    try {
      const { variables } = this.config;
      
      // Assign the variables into the global context
      if (variables && typeof variables === 'object') {
        for (const [key, value] of Object.entries(variables)) {
          // Store it in the context variables
          context.variables[key] = value;
        }
      }

      return {
        status: 'COMPLETED',
        output: { assignedVariables: variables },
      };
    } catch (error) {
      return {
        status: 'FAILED',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
