'use client';

import { AppBar, Box, Button, Toolbar, Tooltip, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import type { ReactNode } from 'react';

import Logo from '@/components/Logo';
import { APP_CONFIG } from '@/config';

interface PublicShellProps {
  /** Where to land after sign-in. Defaults to `/dashboard`. */
  signInCallbackUrl?: string;
}

/**
 * Lean top bar for unauthenticated routes (e.g. `/messages`). Logo on the
 * left, single Sign-In CTA on the right — no dashboard nav, no auth-state
 * branching. Pair with `DashboardShell` (the signed-in shell) as the two ends
 * of the auth spectrum.
 */
export default function PublicShell({
  children,
  signInCallbackUrl = APP_CONFIG.routes.dashboard,
}: { children: ReactNode } & PublicShellProps) {
  return (
    <section>
      <AppBar
        position="static"
        sx={{ bgcolor: 'primary.dark' }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Home">
              <Box
                component={Link}
                href={APP_CONFIG.routes.home}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                <Logo
                  variant="full"
                  width={35}
                  height={35}
                />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  {APP_CONFIG.app.title}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
          <Button
            color="inherit"
            startIcon={<LoginIcon />}
            onClick={() => signIn('tcss460', { callbackUrl: signInCallbackUrl })}
          >
            Sign in
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </section>
  );
}
