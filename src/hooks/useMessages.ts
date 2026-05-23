'use client';

import { useEffect, useState } from 'react';

import type { Priority } from '@/types/priority';
import type { Message, MessagesListResponse } from '@/types/message';
import { ApiError, apiGet } from '@/lib/api';

/**
 * Pagination + sort defaults for the demo. Backend-3 paginates server-side;
 * we ask for the most-recent 50 and call it a day. Real apps would lift these
 * to component props (or URL searchParams) and add UI for paging.
 */
const PAGE = '1';
const PAGE_LIMIT = '50';
const SORT_FIELD = 'createdAt';
const SORT_ORDER = 'desc';

interface UseMessagesResult {
  messages: Message[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Fetches `GET /v2/messages` with an optional priority filter. The filter
 * round-trips through the API (server-side `WHERE priority = ?`) so the toggle
 * is a real query-param-driven fetch, not a client-side filter.
 *
 * Reload via the returned `reload()` — used after a delete to pull a fresh list.
 *
 * Cancels in-flight requests via `AbortController` when `priority` changes
 * mid-fetch, so a slow response can't overwrite a fresher one.
 */
export function useMessages(priority: Priority | null): UseMessagesResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      page: PAGE,
      limit: PAGE_LIMIT,
      sort: SORT_FIELD,
      order: SORT_ORDER,
    });
    if (priority !== null) {
      params.set('priority', String(priority));
    }

    apiGet<MessagesListResponse>(`/v2/messages?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (controller.signal.aborted) return;
        setMessages(response.data ?? []);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof ApiError ? err.message : String(err));
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setLoading(false);
      });

    return () => controller.abort();
  }, [priority, reloadTick]);

  return {
    messages,
    loading,
    error,
    reload: () => setReloadTick((tick) => tick + 1),
  };
}
