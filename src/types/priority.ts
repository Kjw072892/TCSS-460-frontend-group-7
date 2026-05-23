export const PRIORITY = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
} as const;

export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY];

export const PRIORITY_LEVELS = [PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH] as const;
