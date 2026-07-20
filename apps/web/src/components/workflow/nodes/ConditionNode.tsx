import { Handle, Position } from '@xyflow/react';
import { Split } from 'lucide-react';

export function ConditionNode({ data }: { data: any }) {
  return (
    <div className="w-64 rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-glow">
      <Handle
        type="target"
        position={Position.Top}
        className="h-3 w-3 border-2 border-background bg-muted-foreground"
      />
      <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-4 py-3 rounded-t-xl">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20 text-orange-500">
          <Split className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Condition</h3>
          <p className="text-xs text-muted-foreground">Branching logic</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm font-mono text-muted-foreground bg-accent px-2 py-1 rounded">
          {data.expression || 'if (true)'}
        </p>
      </div>
      
      {/* True path */}
      <div className="absolute -bottom-1.5 left-1/4 text-[10px] font-bold text-green-500 translate-y-full -translate-x-1/2">
        TRUE
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ left: '25%' }}
        className="h-3 w-3 border-2 border-background bg-green-500"
      />
      
      {/* False path */}
      <div className="absolute -bottom-1.5 right-1/4 text-[10px] font-bold text-red-500 translate-y-full translate-x-1/2">
        FALSE
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ left: '75%' }}
        className="h-3 w-3 border-2 border-background bg-red-500"
      />
    </div>
  );
}
