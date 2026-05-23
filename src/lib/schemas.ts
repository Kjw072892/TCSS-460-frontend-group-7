import { z } from 'zod';

/**
 * Zod schema for the new-message form. Mirrors the `POST /v2/messages` body
 * accepted by `backend-3`: `content` is required, `priority` is one of
 * `1 | 2 | 3`, and `subject` is optional.
 *
 * The `priority` field uses `z.number()` rather than the literal-union
 * `Priority` type because `<Controller>` round-trips its value through DOM
 * events; coercion stays inside the form layer.
 */
export const CreateMessageSchema = z.object({
  subject: z.string().trim().max(120, 'Subject must be 120 characters or fewer').optional(),
  content: z
    .string()
    .trim()
    .min(1, 'Message content is required')
    .max(2000, 'Message content must be 2000 characters or fewer'),
  priority: z.union([z.literal(1), z.literal(2), z.literal(3)], {
    message: 'Pick a priority',
  }),
});

export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
