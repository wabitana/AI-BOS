import { Palette, Monitor, Moon, Sun } from 'lucide-react';

/**
 * Appearance settings — theme and display preferences.
 */
export default function AppearancePage() {
  const themes = [
    { key: 'dark', label: 'Dark', icon: Moon, active: true },
    { key: 'light', label: 'Light', icon: Sun, active: false },
    { key: 'system', label: 'System', icon: Monitor, active: false },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Palette className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
          <p className="text-sm text-muted-foreground">Customize how AI-BOS looks.</p>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="rounded-xl border border-border bg-card">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-medium text-foreground">Theme</h3>
          <p className="text-xs text-muted-foreground mt-1">Choose your preferred color mode.</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {themes.map((theme) => {
              const Icon = theme.icon;
              return (
                <button
                  key={theme.key}
                  className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all duration-200 ${
                    theme.active
                      ? 'border-primary bg-primary/5 shadow-glow'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <Icon className={`h-6 w-6 ${theme.active ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${theme.active ? 'text-primary' : 'text-foreground'}`}>
                    {theme.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Accent Color */}
      <div className="rounded-xl border border-border bg-card">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-medium text-foreground">Accent Color</h3>
          <p className="text-xs text-muted-foreground mt-1">Select the primary accent color.</p>
        </div>
        <div className="p-6">
          <div className="flex gap-3">
            {['#6d5acf', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'].map((color) => (
              <button
                key={color}
                className={`h-10 w-10 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                  color === '#6d5acf' ? 'border-foreground ring-2 ring-foreground/20' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
