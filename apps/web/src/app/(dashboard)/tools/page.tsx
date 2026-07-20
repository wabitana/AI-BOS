import {
  Wrench,
  Activity,
  AlertTriangle,
  Clock,
  DollarSign,
  Search,
  Brain,
  Image,
  Video,
  Mic,
  Globe,
  Monitor,
  HardDrive,
  Database,
  Share2,
  Mail,
  CalendarDays,
  Webhook,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { getToolUsageLogs, getToolUsageStats } from './actions';
import Link from 'next/link';
import type { ToolUsageLog } from '@ai-bos/database';

/** Built-in tool catalog — static definition of all supported tool categories */
const TOOL_CATALOG = [
  { name: 'LLM', description: 'Text generation via OpenAI, Anthropic, Gemini, OpenRouter', icon: Brain, status: 'available' },
  { name: 'Video Generation', description: 'AI-powered video creation and editing', icon: Video, status: 'available' },
  { name: 'Image Generation', description: 'Generate images via Replicate, DALL-E, Midjourney', icon: Image, status: 'available' },
  { name: 'Audio', description: 'Text-to-speech, transcription via ElevenLabs', icon: Mic, status: 'available' },
  { name: 'Search', description: 'Web search via Tavily, Serper, Google', icon: Search, status: 'available' },
  { name: 'Browser Automation', description: 'Web scraping and browser control', icon: Monitor, status: 'coming_soon' },
  { name: 'Storage', description: 'File storage via Cloudflare R2, S3', icon: HardDrive, status: 'available' },
  { name: 'Database', description: 'Direct database queries and operations', icon: Database, status: 'available' },
  { name: 'Social Media', description: 'Post to YouTube, TikTok, X, LinkedIn', icon: Share2, status: 'coming_soon' },
  { name: 'Email', description: 'Send emails via Resend, SendGrid', icon: Mail, status: 'available' },
  { name: 'Calendar', description: 'Calendar and scheduling integrations', icon: CalendarDays, status: 'coming_soon' },
  { name: 'Webhooks', description: 'Inbound and outbound webhook triggers', icon: Webhook, status: 'available' },
] as const;

export default async function ToolsPage() {
  const [stats, { logs }] = await Promise.all([
    getToolUsageStats(),
    getToolUsageLogs({ limit: 20 }),
  ]);

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Tool Registry</h1>
            <p className="mt-1 text-muted-foreground">
              Available tools, health status, and usage analytics.
            </p>
          </div>
        </div>
        <Link
          href="/settings/providers"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
        >
          Manage API Keys
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={Activity} label="Total Calls" value={stats.totalCalls.toLocaleString()} />
        <StatsCard icon={AlertTriangle} label="Errors" value={stats.totalErrors.toLocaleString()} variant="destructive" />
        <StatsCard icon={Clock} label="Avg Latency" value={`${stats.avgLatency}ms`} />
        <StatsCard icon={DollarSign} label="Total Cost" value={`$${stats.totalCost.toFixed(4)}`} />
      </div>

      {/* Tool Catalog */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Available Tools</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOL_CATALOG.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.name}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{tool.name}</span>
                    {tool.status === 'available' ? (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-500">
                        <Globe className="h-2.5 w-2.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Usage Logs Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Usage</h2>
        {logs.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">No usage yet</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Tool usage will appear here once agents start using tools.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Tool</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Latency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.map((log: ToolUsageLog) => (
                    <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{log.toolName}</td>
                      <td className="px-4 py-3">
                        {log.status === 'SUCCESS' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-500">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-destructive">
                            <XCircle className="h-3.5 w-3.5" /> Error
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{log.latencyMs}ms</td>
                      <td className="px-4 py-3 text-muted-foreground">${log.cost.toFixed(4)}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({
  icon: Icon,
  label,
  value,
  variant,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  variant?: 'destructive';
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            variant === 'destructive' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

