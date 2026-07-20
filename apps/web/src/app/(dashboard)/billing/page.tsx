import { CreditCard, Check } from 'lucide-react';

interface PlanCard {
  readonly name: string;
  readonly price: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly current: boolean;
}

const PLANS: readonly PlanCard[] = [
  {
    name: 'Free',
    price: '$0',
    description: 'Get started with basic AI capabilities.',
    features: ['1 Workspace', '3 AI Agents', '1,000 tokens/mo', 'Community support'],
    current: true,
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'Scale your AI operations.',
    features: ['5 Workspaces', 'Unlimited Agents', '100K tokens/mo', 'Priority support', 'Custom tools'],
    current: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For teams that need full control.',
    features: ['Unlimited Workspaces', 'Unlimited Agents', 'Unlimited tokens', 'Dedicated support', 'SSO & RBAC', 'On-prem option'],
    current: false,
  },
] as const;

/**
 * Billing and subscription management page.
 */
export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription and payment methods.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-xl border bg-card p-6 transition-all duration-300 ${
              plan.current
                ? 'border-primary shadow-glow'
                : 'border-border hover:border-primary/40'
            }`}
          >
            {plan.current && (
              <div className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                Current Plan
              </div>
            )}
            <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold text-foreground">{plan.price}</span>
              {plan.price !== 'Custom' && (
                <span className="text-sm text-muted-foreground">/month</span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                plan.current
                  ? 'border border-border bg-muted text-muted-foreground cursor-default'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
              disabled={plan.current}
            >
              {plan.current ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
