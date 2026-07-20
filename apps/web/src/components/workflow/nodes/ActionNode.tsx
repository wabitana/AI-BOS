import { Handle, Position } from '@xyflow/react';
import { Zap } from 'lucide-react';

export function ActionNode({ data }: { data: any }) {
  return (
    <div className="w-64 rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-glow">
      <Handle
        type="target"
        position={Position.Top}
        className="h-3 w-3 border-2 border-background bg-muted-foreground"
      />
      <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-4 py-3 rounded-t-xl">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-foreground">
          <Zap className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Action</h3>
          <p className="text-xs text-muted-foreground">{data.type || 'Generic Task'}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm font-medium text-foreground">{data.label || 'Execute Action'}</p>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="h-3 w-3 border-2 border-background bg-muted-foreground"
      />
    </div>
  );
}
