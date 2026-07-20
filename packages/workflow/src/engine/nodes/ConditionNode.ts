import { BaseNode, NodeExecutionResult, WorkflowContext } from '../BaseNode';

export class ConditionNode extends BaseNode {
  constructor(id: string, name: string, config: Record<string, any>) {
    super(id, 'CONDITION', name, config);
  }

  async execute(context: WorkflowContext): Promise<NodeExecutionResult> {
    try {
      const { expression, truePathId, falsePathId } = this.config;
      
      // Simple expression evaluator for the MVP (e.g., "variables.count > 10")
      // In production, we'd use a sandboxed evaluator like json-rules-engine or isolated-vm
      
      // We will parse simple string interpolations or direct checks
      // For safety, we only support basic checks without `eval` in this MVP
      let result = false;
      if (expression && expression.field && expression.operator && expression.value !== undefined) {
        const val = this.resolveValue(expression.field, context);
        
        switch (expression.operator) {
          case '===':
          case '==':
            result = val == expression.value;
            break;
          case '!==':
          case '!=':
            result = val != expression.value;
            break;
          case '>':
            result = val > expression.value;
            break;
          case '<':
            result = val < expression.value;
            break;
          case '>=':
            result = val >= expression.value;
            break;
          case '<=':
            result = val <= expression.value;
            break;
          case 'contains':
            result = typeof val === 'string' && val.includes(expression.value);
            break;
          default:
            result = false;
        }
      }

      return {
        status: 'COMPLETED',
        output: { result },
        nextNodeIds: result ? [truePathId].filter(Boolean) : [falsePathId].filter(Boolean),
      };
    } catch (error) {
      return {
        status: 'FAILED',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private resolveValue(path: string, context: WorkflowContext): any {
    if (path.startsWith('variables.')) {
      const key = path.replace('variables.', '');
      return context.variables[key];
    }
    if (path.startsWith('results.')) {
      const parts = path.split('.'); // results.nodeId.outputKey
      if (parts.length >= 3) {
        return context.results[parts[1]]?.[parts[2]];
      }
    }
    return undefined;
  }
}
