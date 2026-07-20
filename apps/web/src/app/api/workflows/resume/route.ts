import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@ai-bos/database';
import { ExecutionEngine, WorkflowContext } from '@ai-bos/workflow';

// Endpoint to resume a paused execution (e.g., from a Human Approval node)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { executionId, nodeId, action, approverId } = body; // action = 'APPROVED' | 'REJECTED'

    if (!executionId || !nodeId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const execution = await prisma.workflowExecution.findUnique({
      where: { id: executionId },
      include: { version: true },
    });

    if (!execution) {
      return NextResponse.json({ error: 'Execution not found' }, { status: 404 });
    }

    if (execution.status !== 'PAUSED') {
      return NextResponse.json({ error: 'Execution is not paused' }, { status: 400 });
    }

    const context = execution.context as unknown as WorkflowContext;
    
    // Inject the human interaction result directly into the node's result
    if (!context.results) context.results = {};
    context.results[nodeId] = { status: action, approverId };

    // Update execution status back to running
    await prisma.workflowExecution.update({
      where: { id: executionId },
      data: {
        status: 'RUNNING',
        context: context as any,
      },
    });

    const nodes = (execution.version.nodes as any) || [];
    const edges = (execution.version.edges as any) || [];

    const engine = new ExecutionEngine(nodes, edges);

    // Resume execution
    executeEngineAsync(execution.id, engine, context).catch(console.error);

    return NextResponse.json({ success: true, status: 'RESUMED' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function executeEngineAsync(executionId: string, engine: ExecutionEngine, context: WorkflowContext) {
  try {
    const finalContext = await engine.execute(context);
    
    await prisma.workflowExecution.update({
      where: { id: executionId },
      data: {
        status: finalContext.status,
        context: finalContext as any,
        completedAt: finalContext.status === 'COMPLETED' || finalContext.status === 'FAILED' ? new Date() : null,
      },
    });
  } catch (error) {
    await prisma.workflowExecution.update({
      where: { id: executionId },
      data: {
        status: 'FAILED',
        completedAt: new Date(),
      },
    });
  }
}
