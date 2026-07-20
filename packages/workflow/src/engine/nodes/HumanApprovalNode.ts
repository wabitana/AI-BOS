import { BaseNode, NodeExecutionResult, WorkflowContext } from '../BaseNode';

export class HumanApprovalNode extends BaseNode {
  constructor(id: string, name: string, config: Record<string, any>) {
    super(id, 'HUMAN_APPROVAL', name, config);
  }

  async execute(context: WorkflowContext): Promise<NodeExecutionResult> {
    // If the approval has already been granted in the context (from a resumed run)
    const storedApproval = context.results[this.id];
    
    if (storedApproval && storedApproval.status === 'APPROVED') {
      return {
        status: 'COMPLETED',
        output: { status: 'APPROVED', approverId: storedApproval.approverId },
      };
    }

    if (storedApproval && storedApproval.status === 'REJECTED') {
      return {
        status: 'FAILED',
        error: 'Human approval rejected.',
      };
    }

    // Otherwise, pause execution and wait for human input
    return {
      status: 'PAUSED',
      output: { message: 'Waiting for human approval.', assignees: this.config.assignees },
    };
  }
}
