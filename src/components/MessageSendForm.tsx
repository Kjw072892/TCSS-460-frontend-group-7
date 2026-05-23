'use client';

import { useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import PrioritySelector from '@/components/PrioritySelector';
import { CreateMessageSchema, type CreateMessageInput } from '@/lib/schemas';
import { ApiError, apiAuthed } from '@/lib/api';
import type { MessageResponse } from '@/types/message';
import type { Priority } from '@/types/priority';
import { APP_CONFIG } from '@/config';

/**
 * Form half of `/messages/send`. The page itself is a server component that
 * gates on `auth()` — by the time this client component renders, the user is
 * known to be signed in, so there's no `useSession` call here.
 */
export default function MessageSendForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateMessageInput>({
    resolver: zodResolver(CreateMessageSchema),
    defaultValues: { subject: '', content: '', priority: 1 },
  });

  const onSubmit = async (data: CreateMessageInput) => {
    setSubmitError(null);
    try {
      await apiAuthed<MessageResponse>('POST', '/v2/messages', data);
      router.push(APP_CONFIG.routes.messagesView);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : String(err));
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: '100%', mt: 2 }}
    >
      <Stack spacing={3}>
        <TextField
          label="Subject (optional)"
          fullWidth
          {...register('subject')}
          error={Boolean(errors.subject)}
          helperText={errors.subject?.message ?? ' '}
        />

        <TextField
          label="Message"
          fullWidth
          multiline
          minRows={4}
          required
          {...register('content')}
          error={Boolean(errors.content)}
          helperText={errors.content?.message ?? ' '}
        />

        <Box>
          <Typography
            variant="subtitle2"
            gutterBottom
            align="center"
          >
            Priority
          </Typography>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <PrioritySelector
                value={field.value as Priority}
                onChange={(_event: MouseEvent<HTMLElement>, next: Priority | null) => {
                  // PrioritySelector deselects to `null`; the form requires a value, so
                  // ignore null and keep the previous selection.
                  if (next !== null) field.onChange(next);
                }}
              />
            )}
          />
          {errors.priority && (
            <Typography
              variant="caption"
              color="error"
              align="center"
              display="block"
              sx={{ mt: 1 }}
            >
              {errors.priority.message}
            </Typography>
          )}
        </Box>

        {submitError && <Alert severity="error">{submitError}</Alert>}

        <Button
          type="submit"
          variant="contained"
          size="large"
          endIcon={<SendIcon />}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending…' : 'Send'}
        </Button>
      </Stack>
    </Box>
  );
}
