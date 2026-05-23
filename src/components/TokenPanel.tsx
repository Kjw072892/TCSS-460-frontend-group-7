'use client';

import { Box, Paper, Stack, Typography } from '@mui/material';

import { decodeJwt, formatExp, type DecodedJwt } from '@/lib/jwt';

interface TokenPanelProps {
  label: string;
  token: string | undefined;
  highlightClaims: string[];
}

/**
 * Decoded view of a JWT for the `/debug` lecture demo. Pulls out the listed
 * claims, with collapsible sections for the full header / payload / raw token.
 */
export default function TokenPanel({ label, token, highlightClaims }: TokenPanelProps) {
  if (!token) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">{label}</Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          No token on the session.
        </Typography>
      </Paper>
    );
  }

  let decoded: DecodedJwt;
  try {
    decoded = decodeJwt(token);
  } catch (err) {
    return (
      <Paper sx={{ p: 2, bgcolor: 'error.light' }}>
        <Typography
          variant="h6"
          color="error"
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 1 }}
        >
          Failed to decode: {err instanceof Error ? err.message : String(err)}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
      >
        {label}
      </Typography>

      <Typography
        variant="overline"
        color="text.secondary"
      >
        Callouts
      </Typography>
      <Box
        component="dl"
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          columnGap: 2,
          rowGap: 0.5,
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          mt: 1,
        }}
      >
        {highlightClaims.map((claim) => {
          const value = decoded.payload[claim];
          return (
            <Stack
              key={claim}
              sx={{ display: 'contents' }}
            >
              <Typography
                component="dt"
                color="text.secondary"
              >
                {claim}
              </Typography>
              <Typography
                component="dd"
                sx={{ m: 0, wordBreak: 'break-all' }}
              >
                {claim === 'exp' ? formatExp(value) : JSON.stringify(value) || '—'}
              </Typography>
            </Stack>
          );
        })}
      </Box>

      <Box
        component="details"
        sx={{ mt: 2 }}
      >
        <Box
          component="summary"
          sx={{ cursor: 'pointer', fontSize: '0.75rem', color: 'text.secondary' }}
        >
          HEADER
        </Box>
        <Box
          component="pre"
          sx={{
            mt: 1,
            p: 1.5,
            bgcolor: 'grey.900',
            color: 'grey.100',
            borderRadius: 1,
            fontSize: '0.75rem',
            overflowX: 'auto',
          }}
        >
          {JSON.stringify(decoded.header, null, 2)}
        </Box>
      </Box>

      <Box
        component="details"
        sx={{ mt: 1 }}
      >
        <Box
          component="summary"
          sx={{ cursor: 'pointer', fontSize: '0.75rem', color: 'text.secondary' }}
        >
          PAYLOAD
        </Box>
        <Box
          component="pre"
          sx={{
            mt: 1,
            p: 1.5,
            bgcolor: 'grey.900',
            color: 'grey.100',
            borderRadius: 1,
            fontSize: '0.75rem',
            overflowX: 'auto',
          }}
        >
          {JSON.stringify(decoded.payload, null, 2)}
        </Box>
      </Box>

      <Box
        component="details"
        sx={{ mt: 1 }}
      >
        <Box
          component="summary"
          sx={{ cursor: 'pointer', fontSize: '0.75rem', color: 'text.secondary' }}
        >
          RAW TOKEN
        </Box>
        <Box
          component="pre"
          sx={{
            mt: 1,
            p: 1.5,
            bgcolor: 'grey.100',
            color: 'text.primary',
            borderRadius: 1,
            fontSize: '0.75rem',
            overflowX: 'auto',
            wordBreak: 'break-all',
            whiteSpace: 'pre-wrap',
          }}
        >
          {token}
        </Box>
      </Box>
    </Paper>
  );
}
