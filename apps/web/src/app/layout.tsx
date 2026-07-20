import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI-BOS — AI Business Operating System',
  description:
    'Enterprise-grade AI platform powering Content OS, Sales OS, Marketing OS, Support OS, and Finance OS.',
};

/**
 * Root layout — wraps every page in the application.
 * Uses React Server Component by default.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
