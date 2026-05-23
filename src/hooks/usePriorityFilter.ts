'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { Priority } from '@/types/priority';

/**
 * Stores the priority filter in the URL's `?priority=` searchParam, not in
 * component `useState`. The toggle now drives the URL, the URL drives
 * `useMessages`, `useMessages` drives the SQL — the round-trip you'd want a
 * student to internalize.
 *
 * Practical wins for free:
 *  - Bookmarkable / shareable filtered views (`/messages?priority=2`).
 *  - Browser back/forward replays the filter.
 *  - Server-rendered initial render reads the same value the client does.
 *
 * Returns `[priority, setPriority]` shaped like `useState` so the migration
 * from `useState<Priority | null>` is a single-line edit at each callsite.
 */
export function usePriorityFilter(): readonly [Priority | null, (next: Priority | null) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const raw = searchParams.get('priority');
  const priority: Priority | null =
    raw === '1' || raw === '2' || raw === '3' ? (Number(raw) as Priority) : null;

  const setPriority = useCallback(
    (next: Priority | null) => {
      const params = new URLSearchParams(searchParams);
      if (next === null) params.delete('priority');
      else params.set('priority', String(next));
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  return [priority, setPriority] as const;
}
