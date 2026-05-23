import { Avatar, Box, Container, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import MessageSendForm from '@/components/MessageSendForm';

/**
 * Send-message page. Naive by design — no `auth()` call, no `useSession()`,
 * no inline sign-in CTA. By the time this renders, `middleware.ts` has
 * already redirected unauthenticated users away. That's the lecture moment:
 * compare with `/profile`, where the page itself does the gating.
 */
export default function MessageSendPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <SendIcon />
        </Avatar>
        <Typography
          component="h1"
          variant="h5"
          gutterBottom
        >
          Send a Message
        </Typography>

        <MessageSendForm />
      </Box>
    </Container>
  );
}
