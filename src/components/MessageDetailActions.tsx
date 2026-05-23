'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { ApiError, apiAuthed } from '@/lib/api';
import { useMyLocalUserId } from '@/hooks/useMyLocalUserId';

interface MessageDetailActionsProps {
  messageId: number;
  authorId: number;
  /** Where to navigate after a successful delete (typically the parent list). */
  redirectAfterDelete: string;
}

/**
 * Client child of the detail page. The page itself is a server component (so
 * it can `await params` and fetch on the server), but "is this message mine?"
 * needs the access token — which only exists in the client session. So the
 * delete button is gated here.
 */
export default function MessageDetailActions({
  messageId,
  authorId,
  redirectAfterDelete,
}: MessageDetailActionsProps) {
  const router = useRouter();
  const { id: myLocalId, error: myIdError } = useMyLocalUserId();
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const canDelete = myLocalId !== null && myLocalId === authorId;
  // Render nothing when there's nothing to show: no delete affordance and no
  // error to surface. Anything else (the button OR the warning OR both) drops
  // into the JSX below.
  if (!canDelete && !myIdError) return null;

  const handleDelete = async () => {
    setError(null);
    setDeleting(true);
    try {
      await apiAuthed('DELETE', `/v2/messages/${messageId}`);
      router.push(redirectAfterDelete);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError('You can only delete your own messages.');
      } else {
        setError(err instanceof ApiError ? err.message : String(err));
      }
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      {myIdError && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
        >
          {myIdError}
        </Alert>
      )}
      {error && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      {canDelete && (
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DeleteIcon />}
          disabled={deleting}
          onClick={handleDelete}
        >
          {deleting ? 'Deleting…' : 'Delete this message'}
        </Button>
      )}
    </Box>
  );
}
