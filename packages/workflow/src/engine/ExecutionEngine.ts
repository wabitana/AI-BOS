import { BaseNode, NodeExecutionResult, WorkflowContext } from './BaseNode';
import { ConditionNode } from './nodes/ConditionNode';
import { HumanApprovalNode } from './nodes/HumanApprovalNode';
import { VariableNode } from './nodes/VariableNode';

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffMs: number;
}

export class ExecutionEngine {
  private nodes: Map<string, BaseNode> = new Map();
  private edges: WorkflowEdge[] = [];

  constructor(
    nodeConfigs: Array<{ id: string; type: string; name: string; config: Record<string, any> }>,
    edges: WorkflowEdge[]
  ) {
    this.edges = edges;
    for (const nc of nodeConfigs) {
      this.nodes.set(nc.id, this.createNode(nc));
    }
  }

  private createNode(nc: { id: string; type: string; name: string; config: Record<string, any> }): BaseNode {
    switch (nc.type) {
      case 'CONDITION':
        return new ConditionNode(nc.id, nc.name, nc.config);
      case 'HUMAN_APPROVAL':
        return new HumanApprovalNode(nc.id, nc.name, nc.config);
      case 'VARIABLE':
        return new VariableNode(nc.id, nc.name, nc.config);
      default:
        // Generic task or tool execution fallback
        return new class extends BaseNode {
          constructor() {
            super(nc.id, nc.type, nc.name, nc.config);
          }
          async execute(): Promise<NodeExecutionResult> {
            return { status: 'COMPLETED', output: { message: 'Mock execution for generic node' } };
          }
        }();
    }
  }

  /**
   * Executes the DAG (Directed Acyclic Graph) of nodes.
   * Supports parallel execution of sibling nodes.
   */
  public async execute(context: WorkflowContext, startNodeIds?: string[]): Promise<WorkflowContext> {
    context.status = 'RUNNING';

    // If no start nodes provided, find nodes with no incoming edges
    let currentLevelIds = startNodeIds;
    if (!currentLevelIds || currentLevelIds.length === 0) {
      const targets = new Set(this.edges.map(e => e.target));
      currentLevelIds = Array.from(this.nodes.keys()).filter(id => !targets.has(id));
    }

    const executed = new Set<string>();

    while (currentLevelIds.length > 0 && context.status === 'RUNNING') {
      const promises = currentLevelIds.map(async (id) => {
        const node = this.nodes.get(id);
        if (!node || executed.has(id)) return null;

        let result = await this.executeNodeWithRetry(node, context);
        
        context.results[id] = result;
        executed.add(id);

        if (result.status === 'PAUSED') {
          context.status = 'PAUSED';
        } else if (result.status === 'FAILED') {
          context.status = 'FAILED';
        }

        return { id, result };
      });

      const levelResults = await Promise.all(promises);

      // If any node failed or paused, break the loop
      if ((context.status as string) === 'FAILED' || (context.status as string) === 'PAUSED') {
        break;
      }

      // Determine the next level of nodes
      const nextLevelSet = new Set<string>();
      
      for (const lr of levelResults) {
        if (!lr) continue;
        const { id, result } = lr;
        
        if (result.nextNodeIds && result.nextNodeIds.length > 0) {
          // If the node specifically overrides next paths (like ConditionNode)
          result.nextNodeIds.forEach(n => nextLevelSet.add(n));
        } else {
          // Find standard outgoing edges
          const outgoingEdges = this.edges.filter(e => e.source === id);
          outgoingEdges.forEach(e => nextLevelSet.add(e.target));
        }
      }

      // Ensure that a node is only executed if all its required incoming edges have been resolved
      // (For simple DAGs, we just ensure we don't execute a target before its dependencies.
      // In this basic engine, we assume simple tree/DAG execution where a node is ready if it's in the nextLevelSet).
      
      currentLevelIds = Array.from(nextLevelSet);
    }

    if (context.status === 'RUNNING') {
      context.status = 'COMPLETED';
    }

    return context;
  }

  private async executeNodeWithRetry(node: BaseNode, context: WorkflowContext): Promise<NodeExecutionResult> {
    const policy: RetryPolicy = node.config.retryPolicy || { maxRetries: 0, backoffMs: 0 };
    let attempts = 0;
    
    while (attempts <= policy.maxRetries) {
      attempts++;
      const result = await node.execute(context);
      
      if (result.status === 'FAILED' && attempts <= policy.maxRetries) {
        if (policy.backoffMs > 0) {
          await new Promise(resolve => setTimeout(resolve, policy.backoffMs));
        }
        continue;
      }
      return result;
    }
    return { status: 'FAILED', error: 'Max retries exceeded' };
  }
}
