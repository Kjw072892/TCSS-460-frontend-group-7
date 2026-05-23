import Link from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { APP_CONFIG } from '@/config';

/**
 * Route-scoped 404. When `page.tsx` calls `notFound()` (bad id, or backend
 * returned 404), Next.js renders this file instead of bubbling up to the
 * root `app/not-found.tsx`. Co-locating the 404 UI with the route lets the
 * message and the back-link be context-specific.
 */
export default function MessageNotFound() {
  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ mt: 8 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
        >
          Message not found
        </Typography>
        <Typography color="text.secondary">
          That message id either doesn&apos;t exist or has been deleted.
        </Typography>
        <Button
          component={Link}
          href={APP_CONFIG.routes.messagesPublic}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
        >
          Back to all messages
        </Button>
      </Box>
    </Container>
  );
}
