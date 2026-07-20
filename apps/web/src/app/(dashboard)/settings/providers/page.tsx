import { KeyRound } from 'lucide-react';
import { getProviderConnections } from './actions';
import { PROVIDERS } from './constants';
import { ProviderList } from './ProviderList';

/**
 * Providers settings page — manage API keys for external services.
 */
export default async function ProvidersPage() {
  const connections = await getProviderConnections();

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">API Providers</h2>
          <p className="text-sm text-muted-foreground">
            Connect your API keys for LLM, image, audio, and other services.
          </p>
        </div>
      </div>

      <ProviderList
        providers={PROVIDERS as unknown as Array<{ name: string; label: string; category: string }>}
        connections={connections}
      />
    </div>
  );
}
