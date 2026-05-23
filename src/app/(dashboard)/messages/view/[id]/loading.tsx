import { Box, CircularProgress, Container } from '@mui/material';

/**
 * Sibling of `app/messages/[id]/loading.tsx` — same Suspense fallback, but
 * inside the dashboard shell so the AppBar stays put while the server
 * component awaits its fetch.
 */
export default function DashboardMessageDetailLoading() {
  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ mt: 6 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    </Container>
  );
}
