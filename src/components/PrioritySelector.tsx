'use client';

import type { MouseEvent } from 'react';
import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { PRIORITY_LEVELS, type Priority } from '@/types/priority';
import PriorityAvatar from './PriorityAvatar';

interface PrioritySelectorProps {
  /**
   * Currently selected priority value, or `null` for "no selection". MUI's
   * exclusive ToggleButtonGroup deselects (returns `null`) when the user
   * clicks the already-selected button.
   */
  value: Priority | null;

  /**
   * Fired when a priority button is clicked. `newPriority` is `null` when the
   * user deselects.
   */
  onChange: (event: MouseEvent<HTMLElement>, newPriority: Priority | null) => void;
}

/**
 * Horizontal toggle row of three priority avatars (Low / Medium / High).
 * Used for both filtering (view page) and selecting (send page).
 */
export default function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="center"
    >
      <ToggleButtonGroup
        exclusive
        value={value}
        onChange={onChange}
      >
        {PRIORITY_LEVELS.map((level) => (
          <ToggleButton
            key={level}
            value={level}
          >
            <PriorityAvatar priority={level} />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
}
