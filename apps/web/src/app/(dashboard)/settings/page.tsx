import { Building2 } from 'lucide-react';

/**
 * General organization settings page.
 * Displays org name, slug, timezone configuration.
 */
export default function SettingsGeneralPage() {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">General</h2>
          <p className="text-sm text-muted-foreground">Manage your organization profile.</p>
        </div>
      </div>

      {/* Organization Name */}
      <div className="rounded-xl border border-border bg-card">
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">Organization Name</h3>
            <p className="text-xs text-muted-foreground mt-1">
              This is the display name for your organization.
            </p>
          </div>
          <input
            type="text"
            placeholder="My Organization"
            className="flex h-10 w-full max-w-md rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
          />
        </div>
        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-3">
          <p className="text-xs text-muted-foreground">Max 100 characters.</p>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:brightness-110">
            Save
          </button>
        </div>
      </div>

      {/* Organization Slug */}
      <div className="rounded-xl border border-border bg-card">
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">Organization Slug</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Used in URLs. Only lowercase letters, numbers, and hyphens.
            </p>
          </div>
          <div className="flex items-center gap-0 max-w-md">
            <span className="flex h-10 items-center rounded-l-lg border border-r-0 border-border bg-muted px-3 text-sm text-muted-foreground">
              ai-bos.app/
            </span>
            <input
              type="text"
              placeholder="my-org"
              className="flex h-10 flex-1 rounded-r-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
            />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-3">
          <p className="text-xs text-muted-foreground">This affects all URLs.</p>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:brightness-110">
            Save
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-destructive/30 bg-card">
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-destructive">Danger Zone</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Permanently delete this organization and all associated data.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end border-t border-destructive/20 bg-destructive/5 px-6 py-3">
          <button className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-all hover:bg-destructive/20">
            Delete Organization
          </button>
        </div>
      </div>
    </div>
  );
}
