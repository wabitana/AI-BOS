'use client';

import { useState, useTransition } from 'react';
import {
  KeyRound,
  Check,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { saveProviderKey, deleteProviderKey } from './actions';

interface ProviderDef {
  name: string;
  label: string;
  category: string;
}

interface ProviderConnection {
  id: string;
  providerName: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProviderListProps {
  providers: ProviderDef[];
  connections: ProviderConnection[];
}

/**
 * Interactive provider list — allows users to add/update/delete API keys.
 */
export function ProviderList({ providers, connections }: ProviderListProps) {
  const connectionMap = new Map(
    connections.map((c) => [c.providerName, c])
  );

  // Group providers by category
  const grouped = providers.reduce<Record<string, ProviderDef[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  const categoryLabels: Record<string, string> = {
    LLM: 'Language Models',
    IMAGE_GENERATION: 'Image Generation',
    AUDIO: 'Audio & Voice',
    SEARCH: 'Search',
    EMAIL: 'Email',
    STORAGE: 'Storage',
    WEBHOOKS: 'Webhooks & Payments',
  };

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([category, providerList]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {categoryLabels[category] ?? category}
          </h3>
          <div className="grid gap-3">
            {providerList.map((provider) => (
              <ProviderRow
                key={provider.name}
                provider={provider}
                connection={connectionMap.get(provider.name) ?? null}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProviderRow({
  provider,
  connection,
}: {
  provider: ProviderDef;
  connection: ProviderConnection | null;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isConnected = connection?.status === 'ACTIVE';

  function handleSave() {
    if (!apiKey.trim()) {
      setError('API key cannot be empty.');
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await saveProviderKey({
        providerName: provider.name,
        apiKey: apiKey.trim(),
      });
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setApiKey('');
        setIsEditing(false);
        setTimeout(() => setSuccess(false), 2000);
      }
    });
  }

  function handleDelete() {
    if (!connection) return;
    startTransition(async () => {
      const result = await deleteProviderKey(connection.id);
      if (result.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="rounded-xl border border-border bg-card transition-all duration-200 hover:border-border/80">
      <div className="flex items-center justify-between p-4">
        {/* Left side: provider info */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {provider.label}
              </span>
              {isConnected && !success && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
                  <Check className="h-3 w-3" /> Connected
                </span>
              )}
              {success && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500 animate-in fade-in">
                  <Check className="h-3 w-3" /> Saved
                </span>
              )}
              {connection?.status === 'INVALID' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                  <AlertCircle className="h-3 w-3" /> Invalid
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {provider.category.replace(/_/g, ' ')}
            </p>
          </div>
        </div>

        {/* Right side: actions */}
        <div className="flex items-center gap-2">
          {isConnected && !isEditing && (
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Remove API key"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          )}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"
            >
              {isConnected ? 'Update Key' : 'Connect'}
            </button>
          )}
        </div>
      </div>

      {/* Expanded form */}
      {isEditing && (
        <div className="border-t border-border px-4 py-3 space-y-3 bg-muted/20">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${provider.label} API key`}
                className="flex h-9 w-full rounded-lg border border-border bg-background px-3 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="h-4 w-4" />
              )}
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setApiKey('');
                setError(null);
              }}
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
          {error && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" /> {error}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Your key will be encrypted at rest using AES-256-GCM. It is never exposed in the UI after saving.
          </p>
        </div>
      )}
    </div>
  );
}
