'use client';

import { cn } from '@/lib/utils';
import {
  Building2,
  Users,
  Shield,
  Bell,
  ScrollText,
  Palette,
  CreditCard,
  FolderOpen,
  KeyRound,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SettingsNavItem {
  readonly label: string;
  readonly href: string;
  readonly icon: React.ElementType;
}

const SETTINGS_NAV: readonly SettingsNavItem[] = [
  { label: 'General', href: '/settings', icon: Building2 },
  { label: 'Members', href: '/settings/members', icon: Users },
  { label: 'Teams', href: '/settings/teams', icon: Shield },
  { label: 'Workspaces', href: '/settings/workspaces', icon: FolderOpen },
  { label: 'Providers', href: '/settings/providers', icon: KeyRound },
  { label: 'Notifications', href: '/settings/notifications', icon: Bell },
  { label: 'Audit Log', href: '/settings/audit-log', icon: ScrollText },
  { label: 'Appearance', href: '/settings/appearance', icon: Palette },
  { label: 'Billing', href: '/settings/billing', icon: CreditCard },
] as const;

/**
 * Settings layout — sidebar navigation + content area.
 * Follows the Linear/GitHub settings pattern.
 */
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your organization, team, and account settings.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Settings Nav */}
        <nav className="w-56 shrink-0 space-y-1" aria-label="Settings navigation">
          {SETTINGS_NAV.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/settings'
                ? pathname === '/settings'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
