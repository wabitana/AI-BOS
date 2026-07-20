import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@ai-bos/database';
import { ExecutionEngine, WorkflowContext } from '@ai-bos/workflow';

// Note: In production, API routes should be secured via API Keys or session auth.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workflowId, version, initialVariables } = body;

    if (!workflowId) {
      return NextResponse.json({ error: 'Missing workflowId' }, { status: 400 });
    }

    // Load the specific version or the latest
    let workflowVersion;
    if (version) {
      workflowVersion = await prisma.workflowVersion.findUnique({
        where: { workflowId_version: { workflowId, version } },
      });
    } else {
      workflowVersion = await prisma.workflowVersion.findFirst({
        where: { workflowId },
        orderBy: { version: 'desc' },
      });
    }

    if (!workflowVersion) {
      return NextResponse.json({ error: 'Workflow version not found' }, { status: 404 });
    }

    // Create execution record
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        workflowVersionId: workflowVersion.id,
        status: 'RUNNING',
        startedAt: new Date(),
        context: { variables: initialVariables || {}, results: {}, status: 'PENDING' },
      },
    });

    // In a real system, we would enqueue this to a background worker (e.g. Inngest / BullMQ).
    // For this prototype, we'll execute it asynchronously in the same process 
    // and let it update the DB when done.
    
    // We parse nodes and edges from JSON
    const nodes = (workflowVersion.nodes as any) || [];
    const edges = (workflowVersion.edges as any) || [];

    const engine = new ExecutionEngine(nodes, edges);
    
    const context: WorkflowContext = {
      variables: initialVariables || {},
      results: {},
      status: 'PENDING'
    };

    // Fire and forget (in reality use a worker queue)
    executeEngineAsync(execution.id, engine, context).catch(console.error);

    return NextResponse.json({ executionId: execution.id, status: 'RUNNING' });
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
        logs: { error: error instanceof Error ? error.message : String(error) },
      },
    });
  }
}
