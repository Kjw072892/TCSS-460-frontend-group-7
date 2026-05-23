'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';

import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

import type { Message } from '@/types/message';
import PriorityAvatar from '@/components/PriorityAvatar';

interface MessageListItemProps {
  message: Message;
  /**
   * Base path used to build the row's link to the detail page. The list page
   * passes the path it lives at (e.g. `/messages` or `/messages/view`) so the
   * detail route stays inside the same shell as the list.
   */
  basePath: string;
  /**
   * When provided AND `canDelete` is true, a Delete IconButton is rendered.
   * If the caller is not the author (`canDelete=false`), no button renders —
   * the row is read-only for that user. Backend-3 is still the source of truth
   * (it would 403 a non-author DELETE), but we hide the affordance to match.
   */
  onDelete?: (id: number) => void;
  canDelete?: boolean;
}

export default function MessageListItem({
  message,
  basePath,
  onDelete,
  canDelete = false,
}: MessageListItemProps) {
  const author = message.author?.username ?? `user #${message.authorId}`;
  const created = new Date(message.createdAt).toLocaleString();
  const showDelete = Boolean(onDelete && canDelete);

  return (
    <ListItem
      disablePadding
      alignItems="flex-start"
      secondaryAction={
        showDelete && (
          <IconButton
            edge="end"
            aria-label="delete"
            sx={{ color: 'secondary.main' }}
            onClick={() => onDelete?.(message.id)}
          >
            <DeleteIcon />
          </IconButton>
        )
      }
    >
      <ListItemButton
        component={Link}
        href={`${basePath}/${message.id}`}
        alignItems="flex-start"
      >
        <ListItemAvatar>
          <PriorityAvatar priority={message.priority} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Stack
              direction="row"
              spacing={1}
              alignItems="baseline"
            >
              {message.subject && (
                <Typography
                  component="span"
                  fontWeight={600}
                >
                  {message.subject}
                </Typography>
              )}
              <Typography component="span">{message.content}</Typography>
            </Stack>
          }
          secondary={
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {author} · {created}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  );
}
