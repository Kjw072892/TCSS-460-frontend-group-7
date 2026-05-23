'use client';

import { Avatar } from '@mui/material';

import { PRIORITY, type Priority } from '@/types/priority';

/**
 * Maps a Priority value to a theme palette path. Returned strings are MUI
 * `sx`-prop tokens (e.g. `'success.dark'`) — no raw hex, no color-pack
 * imports — so the colors track the theme if it's later customized.
 */
function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case PRIORITY.LOW:
      return 'success.dark';
    case PRIORITY.MEDIUM:
      return 'warning.main';
    case PRIORITY.HIGH:
      return 'error.dark';
    default: {
      const exhaustiveCheck: never = priority;
      console.warn(`Unknown priority: ${exhaustiveCheck}`);
      return 'grey.800';
    }
  }
}

interface PriorityAvatarProps {
  priority: Priority;
}

export default function PriorityAvatar({ priority }: PriorityAvatarProps) {
  return (
    <Avatar
      sx={{ bgcolor: getPriorityColor(priority) }}
      variant="rounded"
    >
      {priority}
    </Avatar>
  );
}
