import { redirect } from 'next/navigation';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import EmailIcon from '@mui/icons-material/Email';

import Logo from '@/components/Logo';
import HomeSignInButton from '@/components/HomeSignInButton';
import { auth } from '@/lib/auth';
import { APP_CONFIG } from '@/config';

/**
 * Public splash. Server component:
 *  - Signed-in users get bounced straight to `/dashboard` (no flash of public
 *    content).
 *  - Signed-out users see two CTAs: Sign In (the auth path) and Browse Public
 *    Messages (the anonymous path). That two-fork landing is the point — it
 *    tells students public and authenticated experiences live side by side.
 */
export default async function HomePage() {
  const session = await auth();
  if (session) {
    redirect(APP_CONFIG.routes.dashboard);
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 6,
        }}
      >
        <Logo
          variant="full"
          width={180}
          height={180}
          sx={{ mb: 3 }}
        />

        <Typography
          variant="h2"
          component="h1"
          gutterBottom
        >
          {APP_CONFIG.app.title}
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          {APP_CONFIG.app.description}
        </Typography>

        <Stack
          spacing={2}
          direction="column"
          sx={{ width: '100%', maxWidth: 320 }}
        >
          <HomeSignInButton callbackUrl={APP_CONFIG.routes.dashboard} />
          <Button
            component={Link}
            href={APP_CONFIG.routes.messagesPublic}
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<EmailIcon />}
          >
            Browse Public Messages
          </Button>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 4 }}
        >
          {APP_CONFIG.course.university} • {APP_CONFIG.course.school}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          {APP_CONFIG.course.code} • {APP_CONFIG.course.semester}
        </Typography>
      </Box>
    </Container>
  );
}
