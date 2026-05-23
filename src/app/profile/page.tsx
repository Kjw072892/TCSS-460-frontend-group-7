import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Avatar, Box, Button, Container, Stack, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';

import { auth } from '@/lib/auth';
import { decodeJwt, formatExp } from '@/lib/jwt';
import { APP_CONFIG } from '@/config';

/**
 * Per-page auth-gate demo.
 *
 * Lives OUTSIDE the `(dashboard)` route group on purpose: middleware does NOT
 * run here. Instead, this server component calls `await auth()` itself and
 * redirects on missing session. That's the right pattern when you have a
 * one-off protected page and don't want to extend the middleware matcher,
 * or when the page legitimately needs the session payload to render (so the
 * `auth()` call has work to do beyond gating).
 *
 * Compare with `(dashboard)/messages/send/page.tsx`, which has no `auth()`
 * call at all — middleware does the gating before the page is reached.
 */
export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    const signInUrl = new URL('/api/auth/signin', 'http://placeholder');
    signInUrl.searchParams.set('callbackUrl', APP_CONFIG.routes.profile);
    // `redirect` accepts relative paths; pathname+search avoids the placeholder origin.
    redirect(`${signInUrl.pathname}${signInUrl.search}`);
  }

  const accessSub = (() => {
    if (!session.accessToken) return null;
    try {
      const sub = decodeJwt(session.accessToken).payload.sub;
      return typeof sub === 'string' ? sub : null;
    } catch {
      return null;
    }
  })();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar sx={{ bgcolor: 'secondary.main' }}>
          <PersonIcon />
        </Avatar>
        <Typography
          variant="h5"
          component="h1"
        >
          Profile
        </Typography>
        <Typography
          color="text.secondary"
          align="center"
          sx={{ mb: 2 }}
        >
          This page lives outside <code>(dashboard)</code>, so middleware doesn&apos;t gate it. The
          page itself calls <code>await auth()</code> and redirects when there&apos;s no session.
        </Typography>

        <Stack
          spacing={1}
          sx={{
            width: '100%',
            p: 2,
            bgcolor: 'grey.100',
            borderRadius: 1,
          }}
        >
          <Row
            label="Name"
            value={session.user?.name ?? '—'}
          />
          <Row
            label="Email"
            value={session.user?.email ?? '—'}
          />
          <Row
            label="id_token sub"
            value={session.user?.id ?? '—'}
          />
          <Row
            label="access_token sub"
            value={accessSub ?? '—'}
          />
          <Row
            label="access_token expires"
            value={formatExp(
              session.accessTokenExpires ? session.accessTokenExpires / 1000 : undefined
            )}
          />
        </Stack>

        <Button
          component={Link}
          href={APP_CONFIG.routes.dashboard}
          variant="outlined"
          startIcon={<HomeIcon />}
        >
          Back to dashboard
        </Button>
      </Box>
    </Container>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ fontSize: '0.875rem' }}
    >
      <Typography
        component="span"
        sx={{ minWidth: 160, color: 'text.secondary' }}
      >
        {label}
      </Typography>
      <Typography
        component="code"
        sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
