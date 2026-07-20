'use client';

import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TriggerNode } from './nodes/TriggerNode';
import { ActionNode } from './nodes/ActionNode';
import { ConditionNode } from './nodes/ConditionNode';
import { ApprovalNode } from './nodes/ApprovalNode';
import { WorkflowSidebar } from './WorkflowSidebar';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  approval: ApprovalNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: { label: 'Manual Execution' },
  },
];

const initialEdges: Edge[] = [];

export function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = {
        x: event.clientX - 300, // rough offset for sidebar
        y: event.clientY - 100,
      };

      const newNode: Node = {
        id: `node_${Date.now()}`,
        type,
        position,
        data: { label: `New ${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const updateNodeData = (nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          return { ...n, data: { ...n.data, ...data } };
        }
        return n;
      })
    );
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Sidebar / Tools */}
      <div className="w-64 border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Tools</h2>
          <p className="text-xs text-muted-foreground">Drag nodes to canvas</p>
        </div>
        <div className="p-4 space-y-3">
          <div
            className="rounded-lg border border-border bg-muted px-4 py-2 text-sm cursor-grab active:cursor-grabbing hover:border-primary/50"
            draggable
            onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'action')}
          >
            Execute Action
          </div>
          <div
            className="rounded-lg border border-border bg-muted px-4 py-2 text-sm cursor-grab active:cursor-grabbing hover:border-primary/50"
            draggable
            onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'condition')}
          >
            Condition Logic
          </div>
          <div
            className="rounded-lg border border-border bg-muted px-4 py-2 text-sm cursor-grab active:cursor-grabbing hover:border-primary/50"
            draggable
            onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'approval')}
          >
            Human Approval
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative" onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-accent/20"
        >
          <Background gap={16} color="var(--border)" />
          <Controls className="!bg-card !border-border !fill-foreground" />
          <MiniMap className="!bg-card !border-border !mask-glow" maskColor="var(--background)" />
        </ReactFlow>
      </div>

      {/* Node Properties Sidebar */}
      {selectedNode && (
        <WorkflowSidebar
          node={selectedNode}
          onChange={(data) => updateNodeData(selectedNode.id, data)}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  );
}
