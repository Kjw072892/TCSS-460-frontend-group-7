import type { ReactNode } from 'react';

import PublicShell from '@/components/PublicShell';

/**
 * Layout for the public `/messages` route. Wraps children in a minimal shell
 * (logo + Sign-In CTA) — no dashboard nav. Distinct from `(dashboard)/layout.tsx`
 * which uses the full `DashboardShell`. After sign-in, `PublicShell`'s default
 * lands the user on `/dashboard`.
 */
export default function MessagesLayout({ children }: { children: ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
