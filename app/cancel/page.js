'use client';

import { Container, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function CancelPage() {
  const router = useRouter();

  const handleReturnHome = () => {
    router.push('/'); // Redirect to the homepage
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '100vh', // Full viewport height
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" gutterBottom>
        Payment Canceled
      </Typography>
      <Typography variant="h6" gutterBottom>
        Your payment was not completed. You can try again.
      </Typography>
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleReturnHome}>
          Return to Home
        </Button>
      </Box>
    </Container>
  );
}
