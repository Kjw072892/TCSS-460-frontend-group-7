import Link from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { APP_CONFIG } from '@/config';

/**
 * Route-scoped 404 inside the dashboard. Sibling of
 * `app/messages/[id]/not-found.tsx` — same idea, dashboard-flavored back link.
 */
export default function DashboardMessageNotFound() {
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
          href={APP_CONFIG.routes.messagesView}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
        >
          Back to Read Messages
        </Button>
      </Box>
    </Container>
  );
}
