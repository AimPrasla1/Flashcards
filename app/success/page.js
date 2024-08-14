'use client';

import { Container, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
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
        Payment Successful
      </Typography>
      <Typography variant="h6" gutterBottom>
        Thank you for your purchase!
      </Typography>
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleReturnHome}>
          Return to Home
        </Button>
      </Box>
    </Container>
  );
}
