'use client';

import { Suspense, useState } from 'react';
import { Avatar, Box, Container, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

import MessagesList from '@/components/MessagesList';
import { ApiError, apiAuthed } from '@/lib/api';
import { useMessages } from '@/hooks/useMessages';
import { useMyLocalUserId } from '@/hooks/useMyLocalUserId';
import { usePriorityFilter } from '@/hooks/usePriorityFilter';
import { APP_CONFIG } from '@/config';

/**
 * Authenticated message view. Reachable via `(dashboard)` — middleware ensures
 * the user is signed in by the time this renders, so no `useSession()` gating
 * is needed.
 *
 * The delete button only renders on rows the signed-in user authored
 * (`myLocalId === message.authorId`). The server is still authoritative and
 * would 403 a non-author DELETE; the UI just hides the affordance to match.
 */
export default function MessageViewPage() {
  return (
    <Suspense fallback={null}>
      <MessageViewInner />
    </Suspense>
  );
}

function MessageViewInner() {
  const [priority, setPriority] = usePriorityFilter();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { messages, loading, error, reload } = useMessages(priority);
  const { id: myLocalId, error: myIdError } = useMyLocalUserId();

  const handleDelete = async (id: number) => {
    setDeleteError(null);
    try {
      await apiAuthed('DELETE', `/v2/messages/${id}`);
      reload();
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setDeleteError('You can only delete your own messages.');
      } else {
        setDeleteError(err instanceof ApiError ? err.message : String(err));
      }
    }
  };

  return (
    <Container
      component="main"
      maxWidth="md"
    >
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <EmailIcon />
        </Avatar>
        <Typography
          component="h1"
          variant="h5"
        >
          Read Messages
        </Typography>

        <MessagesList
          messages={messages}
          loading={loading}
          error={error}
          priority={priority}
          onPriorityChange={setPriority}
          basePath={APP_CONFIG.routes.messagesView}
          onDelete={handleDelete}
          myLocalId={myLocalId}
          notice={
            deleteError
              ? {
                  severity: 'warning',
                  message: deleteError,
                  onClose: () => setDeleteError(null),
                }
              : myIdError
                ? { severity: 'warning', message: myIdError }
                : null
          }
        />
      </Box>
    </Container>
  );
}
