'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { Alert, Box, Button, CircularProgress, Container, Stack, Typography } from '@mui/material';

import TokenPanel from '@/components/TokenPanel';

type VerifyResult =
  | { state: 'idle' }
  | { state: 'verifying' }
  | { state: 'ok'; payload: JWTPayload }
  | { state: 'fail'; error: string };

const ISSUER = process.env.NEXT_PUBLIC_AUTH_ISSUER;
const AUDIENCE = process.env.NEXT_PUBLIC_AUTH_AUDIENCE;

const JWKS = ISSUER ? createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks.json`)) : null;

/**
 * Inspect the session tokens and verify the access_token's signature against
 * the issuer's JWKS. Pure teaching tool — no production app should expose this.
 *
 * Reachable via `(dashboard)`, so middleware guarantees there's a session by
 * the time this renders. We still use `useSession()` for the token *data*,
 * not as a gate. The brief `loading` state is the SessionProvider hydrating
 * on first paint — it's not a re-auth check.
 */
export default function DebugPage() {
  const { data: session, status } = useSession();
  const [result, setResult] = useState<VerifyResult>({ state: 'idle' });

  async function verify() {
    if (!session?.accessToken || !JWKS || !ISSUER || !AUDIENCE) {
      setResult({
        state: 'fail',
        error: 'Missing access token or NEXT_PUBLIC_AUTH_* env vars',
      });
      return;
    }
    setResult({ state: 'verifying' });
    try {
      const { payload } = await jwtVerify(session.accessToken, JWKS, {
        issuer: ISSUER,
        audience: AUDIENCE,
      });
      setResult({ state: 'ok', payload });
    } catch (err) {
      setResult({
        state: 'fail',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  if (status === 'loading' || !session) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 6 }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
          >
            Debug
          </Typography>
          <Typography color="text.secondary">
            The left panel is the OIDC <code>id_token</code> (identity). The right panel is the
            OAuth <code>access_token</code> (authorization to call <code>backend-3</code>). Verify
            round-trips against the issuer&apos;s JWKS.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          }}
        >
          <TokenPanel
            label="id_token"
            token={session.idToken}
            highlightClaims={['iss', 'sub', 'aud', 'email', 'exp']}
          />
          <TokenPanel
            label="access_token"
            token={session.accessToken}
            highlightClaims={['iss', 'sub', 'aud', 'role', 'exp']}
          />
        </Box>

        <Box>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
          >
            <Button
              variant="contained"
              onClick={verify}
              disabled={result.state === 'verifying'}
            >
              {result.state === 'verifying' ? 'Verifying…' : 'Verify access_token against JWKS'}
            </Button>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              iss: <code>{ISSUER ?? 'unset'}</code> · aud: <code>{AUDIENCE ?? 'unset'}</code>
            </Typography>
          </Stack>

          {result.state === 'ok' && (
            <Alert
              severity="success"
              sx={{ mt: 2 }}
            >
              <Typography
                fontWeight={600}
                gutterBottom
              >
                Verified ✓
              </Typography>
              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 1.5,
                  bgcolor: 'grey.900',
                  color: 'grey.100',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  overflowX: 'auto',
                }}
              >
                {JSON.stringify(result.payload, null, 2)}
              </Box>
            </Alert>
          )}
          {result.state === 'fail' && (
            <Alert
              severity="error"
              sx={{ mt: 2 }}
            >
              Invalid ✗ — {result.error}
            </Alert>
          )}
        </Box>
      </Stack>
    </Container>
  );
}
