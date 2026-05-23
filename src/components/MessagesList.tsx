'use client';

import { Fragment, type MouseEvent } from 'react';
import { Alert, Box, CircularProgress, Divider, List, Typography } from '@mui/material';

import type { Priority } from '@/types/priority';
import type { Message } from '@/types/message';
import PrioritySelector from '@/components/PrioritySelector';
import MessageListItem from '@/components/MessageListItem';

interface MessagesListProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
  priority: Priority | null;
  onPriorityChange: (priority: Priority | null) => void;
  /**
   * Base path used by each row to build its detail-page link. Pass the path
   * the list page lives at (e.g. `/messages` or `/messages/view`) so the
   * detail route stays inside the same shell as the list.
   */
  basePath: string;
  /**
   * When provided, the delete button is rendered on each row whose author
   * matches `myLocalId` (the signed-in user's local backend-3 id). Rows
   * authored by anyone else show no button at all — the server is still the
   * authority (it would 403 a non-author DELETE), the UI just doesn't tease
   * an action that wouldn't succeed. When omitted, no delete buttons render.
   */
  onDelete?: (id: number) => void;
  myLocalId?: number | null;
  /** Optional banner above the list — e.g. delete-failed warning. */
  notice?: {
    severity: 'warning' | 'error' | 'info' | 'success';
    message: string;
    onClose?: () => void;
  } | null;
}

/**
 * Renders the priority filter + list with shared loading/error/empty states.
 * Reused by the public `/messages` view (no delete) and the dashboard
 * `/messages/view` (with delete).
 */
export default function MessagesList({
  messages,
  loading,
  error,
  priority,
  onPriorityChange,
  basePath,
  onDelete,
  myLocalId = null,
  notice = null,
}: MessagesListProps) {
  const handlePriorityChange = (_event: MouseEvent<HTMLElement>, next: Priority | null) =>
    onPriorityChange(next);

  return (
    <>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        {priority === null ? 'Showing all priorities' : `Filtering by priority ${priority}`}
      </Typography>

      <PrioritySelector
        value={priority}
        onChange={handlePriorityChange}
      />

      <Box sx={{ mt: 2, width: '100%' }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ my: 2 }}
          >
            Failed to load messages: {error}
          </Alert>
        )}

        {notice && (
          <Alert
            severity={notice.severity}
            sx={{ my: 2 }}
            onClose={notice.onClose}
          >
            {notice.message}
          </Alert>
        )}

        {!loading && !error && messages.length === 0 && (
          <Typography
            align="center"
            color="text.secondary"
            sx={{ py: 4 }}
          >
            No messages found.
          </Typography>
        )}

        {!loading && !error && messages.length > 0 && (
          <List>
            {messages.map((msg, index) => (
              <Fragment key={msg.id}>
                <MessageListItem
                  message={msg}
                  basePath={basePath}
                  onDelete={onDelete}
                  canDelete={myLocalId !== null && msg.authorId === myLocalId}
                />
                {index < messages.length - 1 && (
                  <Divider
                    variant="middle"
                    component="li"
                  />
                )}
              </Fragment>
            ))}
          </List>
        )}
      </Box>
    </>
  );
}
