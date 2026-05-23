import { Box, CircularProgress, Container } from '@mui/material';

/**
 * App Router idiom: a `loading.tsx` file alongside `page.tsx` is auto-wrapped
 * in a Suspense boundary. While the server component on `page.tsx` is awaiting
 * its data fetch, this UI is what the client sees. Free Suspense, no
 * boilerplate. Same idea applies to `error.tsx` (caught render errors).
 */
export default function MessageDetailLoading() {
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
