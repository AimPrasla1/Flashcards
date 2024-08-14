'use client';

import { SignUp } from '@clerk/nextjs';
import { Container, Box, Typography } from '@mui/material';

export default function SignUpPage() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Sign Up
        </Typography>
      </Box>
      <SignUp />
    </Container>
  );
}
