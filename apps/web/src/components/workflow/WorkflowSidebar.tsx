import { X } from 'lucide-react';
import { Node } from '@xyflow/react';

interface WorkflowSidebarProps {
  node: Node;
  onChange: (data: any) => void;
  onClose: () => void;
}

export function WorkflowSidebar({ node, onChange, onClose }: WorkflowSidebarProps) {
  const data = node.data as Record<string, any>;
  return (
    <div className="w-80 border-l border-border bg-card flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground">Node Properties</h3>
          <p className="text-xs text-muted-foreground uppercase">{node.type}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">Label</label>
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => onChange({ label: e.target.value })}
            className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>

        {node.type === 'condition' && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Expression</label>
            <input
              type="text"
              value={data.expression || ''}
              onChange={(e) => onChange({ expression: e.target.value })}
              placeholder="variables.amount > 100"
              className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
            <p className="text-xs text-muted-foreground">E.g., variables.status === 'ACTIVE'</p>
          </div>
        )}

        {node.type === 'action' && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Max Retries</label>
            <input
              type="number"
              min="0"
              max="5"
              value={data.maxRetries || 0}
              onChange={(e) => onChange({ maxRetries: parseInt(e.target.value) })}
              className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
        )}

        {node.type === 'approval' && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Assignees (comma-separated)</label>
            <input
              type="text"
              value={data.assignees?.join(', ') || ''}
              onChange={(e) => onChange({ assignees: e.target.value.split(',').map(s => s.trim()) })}
              placeholder="owner@org.com, admin@org.com"
              className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
        )}
      </div>
    </div>
  );
}
