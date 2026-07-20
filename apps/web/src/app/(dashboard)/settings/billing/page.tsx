import { CreditCard } from 'lucide-react';

/**
 * Billing settings page — placeholder for Phase 9.
 */
export default function BillingSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Billing</h2>
          <p className="text-sm text-muted-foreground">Manage your subscription and payment methods.</p>
        </div>
      </div>

      {/* Current Plan */}
      <div className="rounded-xl border border-border bg-card">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-foreground">Current Plan</h3>
              <p className="text-xs text-muted-foreground mt-1">You are currently on the Free plan.</p>
            </div>
            <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Free
            </span>
          </div>
        </div>
        <div className="flex items-center justify-end border-t border-border bg-muted/30 px-6 py-3">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:brightness-110">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
        <CreditCard className="mx-auto h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-sm font-medium text-foreground">Full billing coming in Phase 9</h3>
        <p className="mt-2 text-xs text-muted-foreground">
          Stripe integration, usage tracking, invoices, and subscription management.
        </p>
      </div>
    </div>
  );
}
