import { Handle, Position } from '@xyflow/react';
import { Play } from 'lucide-react';

export function TriggerNode({ data }: { data: any }) {
  return (
    <div className="w-64 rounded-xl border-2 border-primary/20 bg-card shadow-glow">
      <div className="flex items-center gap-3 border-b border-border bg-primary/5 px-4 py-3 rounded-t-xl">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
          <Play className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Trigger</h3>
          <p className="text-xs text-muted-foreground">Starts the workflow</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-foreground">{data.label || 'Manual Trigger'}</p>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="h-3 w-3 border-2 border-background bg-primary"
      />
    </div>
  );
}
