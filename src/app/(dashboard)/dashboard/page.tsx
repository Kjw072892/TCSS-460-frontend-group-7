import Link from 'next/link';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import BugReportIcon from '@mui/icons-material/BugReport';
import type { ReactNode } from 'react';

import { auth } from '@/lib/auth';
import { APP_CONFIG } from '@/config';

/**
 * Dashboard landing — the first thing a signed-in user sees. Reachable at
 * `/dashboard`, gated by `middleware.ts` along with the rest of the
 * `(dashboard)` group. We still call `await auth()` here, but only to read
 * the session payload (display name) — not as a guard.
 */
export default async function DashboardPage() {
  const session = await auth();
  const greeting = session?.user?.name ?? session?.user?.email ?? 'there';

  return (
    <Container
      maxWidth="md"
      sx={{ mt: 6 }}
    >
      <Stack spacing={4}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
          >
            Welcome, {greeting}
          </Typography>
          <Typography color="text.secondary">
            Pick a destination. Each of these lives inside <code>(dashboard)</code> and is gated by{' '}
            <code>middleware.ts</code>; the pages themselves don&apos;t do auth checks.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          }}
        >
          <Tile
            href={APP_CONFIG.routes.messagesView}
            icon={<EmailIcon fontSize="large" />}
            title="Read Messages"
            description="GET /v2/messages with a priority filter; delete your own."
          />
          <Tile
            href={APP_CONFIG.routes.messagesSend}
            icon={<SendIcon fontSize="large" />}
            title="Send a Message"
            description="POST /v2/messages with RHF + Zod validation."
          />
          <Tile
            href={APP_CONFIG.routes.profile}
            icon={<PersonIcon fontSize="large" />}
            title="Profile"
            description="Per-page auth() demo — outside the (dashboard) group."
          />
          <Tile
            href={APP_CONFIG.routes.debug}
            icon={<BugReportIcon fontSize="large" />}
            title="Token Debug"
            description="Inspect id_token / access_token; verify against JWKS."
          />
        </Box>
      </Stack>
    </Container>
  );
}

function Tile({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card variant="outlined">
      <CardActionArea
        component={Link}
        href={href}
        sx={{ height: '100%' }}
      >
        <CardContent>
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
          >
            <Box sx={{ color: 'secondary.main' }}>{icon}</Box>
            <Box>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
              >
                {title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {description}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
