'use client';

import { Suspense } from 'react';
import { Box, Container, Typography } from '@mui/material';

import MessagesList from '@/components/MessagesList';
import { useMessages } from '@/hooks/useMessages';
import { usePriorityFilter } from '@/hooks/usePriorityFilter';
import { APP_CONFIG } from '@/config';

/**
 * Public read-only message feed. Anyone can browse — no sign-in required.
 * No delete, no compose CTA-in-page (the AppBar's Sign-In button is the
 * single conversion path). Filter by priority is the same query-param round-
 * trip the dashboard uses, so the lecture point about "the toggle drives the
 * URL drives the SQL" still lands here.
 */
export default function PublicMessagesPage() {
  return (
    <Suspense fallback={null}>
      <PublicMessagesView />
    </Suspense>
  );
}

/**
 * Inner component that actually reads `useSearchParams`. Next.js requires
 * any client component using `useSearchParams` to be wrapped in `Suspense`
 * so the static-render path has a fallback while params resolve.
 */
function PublicMessagesView() {
  const [priority, setPriority] = usePriorityFilter();
  const { messages, loading, error } = useMessages(priority);

  return (
    <Container
      component="main"
      maxWidth="md"
    >
      <Box
        sx={{
          mt: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          gutterBottom
        >
          Public Messages
        </Typography>

        <MessagesList
          messages={messages}
          loading={loading}
          error={error}
          priority={priority}
          onPriorityChange={setPriority}
          basePath={APP_CONFIG.routes.messagesPublic}
        />
      </Box>
    </Container>
  );
}
