import { Bell } from 'lucide-react';

/**
 * Notification settings page — configure notification preferences.
 */
export default function NotificationSettingsPage() {
  const channels = [
    { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
    { key: 'browser', label: 'Browser Notifications', description: 'Get push notifications in your browser' },
    { key: 'in-app', label: 'In-App Notifications', description: 'Show notifications in the app header' },
  ];

  const categories = [
    { key: 'member', label: 'Member Activity', description: 'Invites, role changes, removals' },
    { key: 'workflow', label: 'Workflow Events', description: 'Workflow completions, failures, approvals' },
    { key: 'agent', label: 'Agent Alerts', description: 'Agent errors, cost thresholds' },
    { key: 'billing', label: 'Billing', description: 'Invoices, payment failures, usage alerts' },
    { key: 'security', label: 'Security', description: 'Sign-in from new device, suspicious activity' },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Bell className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
          <p className="text-sm text-muted-foreground">Choose how and when you receive notifications.</p>
        </div>
      </div>

      {/* Channels */}
      <div className="rounded-xl border border-border bg-card">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-medium text-foreground">Channels</h3>
        </div>
        <div className="divide-y divide-border">
          {channels.map((ch) => (
            <div key={ch.key} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-foreground">{ch.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{ch.description}</p>
              </div>
              {/* Toggle */}
              <button
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                role="switch"
                aria-checked="true"
              >
                <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-primary transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-xl border border-border bg-card">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-medium text-foreground">Categories</h3>
        </div>
        <div className="divide-y divide-border">
          {categories.map((cat) => (
            <div key={cat.key} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-foreground">{cat.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
              </div>
              <button
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                role="switch"
                aria-checked="true"
              >
                <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-primary transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
