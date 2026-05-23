import Link from 'next/link';
import { Box, Chip, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import type { Message } from '@/types/message';
import PriorityAvatar from '@/components/PriorityAvatar';
import MessageDetailActions from '@/components/MessageDetailActions';

interface MessageDetailContentProps {
  message: Message;
  /** The raw `params.id` value — surfaced in the lecture banner. */
  rawId: string;
  /** Where the back-arrow link goes — typically the parent list. */
  backHref: string;
  backLabel: string;
  /** Where to redirect after a successful delete. */
  redirectAfterDelete: string;
}

/**
 * Shared body of `/messages/[id]` (PublicShell) and
 * `/messages/view/[id]` (DashboardShell). Both pages fetch the message on
 * the server and hand it here for rendering, so the layout stays identical
 * across shells while the back-link / post-delete redirect track the route
 * the user actually came from.
 */
export default function MessageDetailContent({
  message,
  rawId,
  backHref,
  backLabel,
  redirectAfterDelete,
}: MessageDetailContentProps) {
  const author = message.author?.username ?? `user #${message.authorId}`;
  const created = new Date(message.createdAt).toLocaleString();
  const updated = new Date(message.updatedAt).toLocaleString();

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ mt: 6 }}
    >
      <Box
        component={Link}
        href={backHref}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          mb: 2,
          color: 'text.secondary',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        <ArrowBackIcon fontSize="small" />
        <Typography variant="body2">{backLabel}</Typography>
      </Box>

      <Typography
        variant="overline"
        color="text.secondary"
        component="div"
      >
        params = {`{ id: '${rawId}' }`}
      </Typography>

      <Paper sx={{ p: 3, mt: 1 }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <PriorityAvatar priority={message.priority} />
          <Box>
            <Typography
              variant="h5"
              component="h1"
            >
              {message.subject ?? '(no subject)'}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Message #{message.id} · {author}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="body1"
          sx={{ whiteSpace: 'pre-wrap' }}
        >
          {message.content}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack
          direction="row"
          sx={{ flexWrap: 'wrap', gap: 1 }}
        >
          <Chip
            label={`priority: ${message.priority}`}
            size="small"
          />
          <Chip
            label={`read: ${message.read}`}
            size="small"
          />
          <Chip
            label={`created: ${created}`}
            size="small"
          />
          {created !== updated && (
            <Chip
              label={`updated: ${updated}`}
              size="small"
            />
          )}
        </Stack>
      </Paper>

      <MessageDetailActions
        messageId={message.id}
        authorId={message.authorId}
        redirectAfterDelete={redirectAfterDelete}
      />
    </Container>
  );
}
