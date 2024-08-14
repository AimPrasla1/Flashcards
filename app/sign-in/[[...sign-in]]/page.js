'use client';

import { SignIn } from '@clerk/nextjs';
import { Container, Box, Typography } from '@mui/material';

export default function SignInPage() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Sign In
        </Typography>
      </Box>
      <Box sx={{ width: '100%' }}>
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          sx={{ width: '100%' }}
        />
      </Box>
    </Container>
  );
}
