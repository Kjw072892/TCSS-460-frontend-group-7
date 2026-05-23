import type { ReactNode } from 'react';
import DashboardShell from '@/components/DashboardShell';

/**
 * Layout for the `(dashboard)` route group — the signed-in area of the app.
 * `middleware.ts` gates every URL inside this group, so child pages can render
 * naively without their own `await auth()` checks. The shell renders the full
 * AppBar with nav and auth controls.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
