'use client';

import { Bell, Search, User } from 'lucide-react';

/**
 * Top navigation bar with search, notifications, and user menu.
 */
export function TopNav() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      {/* Search */}
      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2 text-sm text-muted-foreground hover:border-ring transition-colors"
          aria-label="Open command palette"
        >
          <Search className="h-4 w-4" />
          <span>Search or command…</span>
          <kbd className="pointer-events-none ml-4 hidden rounded border border-border bg-background px-1.5 py-0.5 text-xs font-mono text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* User Avatar */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
          aria-label="User menu"
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
