'use client';

import { Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { signIn } from 'next-auth/react';

import { APP_CONFIG } from '@/config';

interface SignInButtonProps {
  callbackUrl?: string;
}

/**
 * Triggers a full-page redirect to auth-squared's authorize endpoint.
 * Auth.js handles the OIDC dance and lands the user back at `callbackUrl`
 * (defaults to `/dashboard` so signed-in users skip the splash).
 */
export default function SignInButton({
  callbackUrl = APP_CONFIG.routes.dashboard,
}: SignInButtonProps) {
  return (
    <Button
      color="inherit"
      startIcon={<LoginIcon />}
      onClick={() => signIn('tcss460', { callbackUrl })}
    >
      Sign in
    </Button>
  );
}
