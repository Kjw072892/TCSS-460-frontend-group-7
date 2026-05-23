'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { ApiError, apiGet } from '@/lib/api';
import { decodeJwt } from '@/lib/jwt';

interface BackendUser {
  id: number;
  subjectId: string;
  username: string;
}
interface UsersListResponse {
  data: BackendUser[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface UseMyLocalUserIdResult {
  /** The signed-in user's local backend-3 numeric id, or null while loading / on failure. */
  id: number | null;
  /** Non-null when lookup failed (network error, decode error, or user not in first 100). */
  error: string | null;
}

/**
 * Resolves the signed-in user's local backend-3 numeric id.
 *
 * Backend-3 keys its `User.subjectId` off the access token's `sub` claim (via
 * `resolveLocalUser`). We decode the *access token* here — not `session.user.id`,
 * which Auth.js sources from the id_token — because the two subs can differ
 * depending on how the issuer mints them. See the comment in `lib/auth.ts`.
 *
 * Used to compute "is this message mine" client-side without a `/me` endpoint.
 * Errors are surfaced via the returned `error` field rather than swallowed —
 * a silent failure here makes every row look like someone else's, which is
 * worse than a visible warning.
 */
export function useMyLocalUserId(): UseMyLocalUserIdResult {
  const { data: session, status } = useSession();
  const [id, setId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.accessToken) {
      setId(null);
      setError(null);
      return;
    }

    let mySub: string | undefined;
    try {
      const sub = decodeJwt(session.accessToken).payload.sub;
      if (typeof sub === 'string') mySub = sub;
    } catch (err) {
      setId(null);
      setError(
        `Could not decode access token: ${err instanceof Error ? err.message : String(err)}`
      );
      return;
    }
    if (!mySub) {
      setId(null);
      setError('Access token is missing the `sub` claim.');
      return;
    }

    const controller = new AbortController();
    setError(null);
    apiGet<UsersListResponse>('/v2/users?limit=100', { signal: controller.signal })
      .then((response) => {
        if (controller.signal.aborted) return;
        const me = response.data.find((u) => u.subjectId === mySub);
        if (me) {
          setId(me.id);
          setError(null);
        } else {
          setId(null);
          setError('Your user record was not found in the first 100 users.');
        }
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setId(null);
        setError(
          `Failed to look up your local user id: ${err instanceof ApiError ? err.message : String(err)}`
        );
      });

    return () => controller.abort();
  }, [status, session?.accessToken]);

  return { id, error };
}
