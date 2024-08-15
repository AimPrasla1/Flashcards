'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Container, Typography, CircularProgress, Button, Box } from '@mui/material';
import { useUser } from '@clerk/nextjs';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const updateUserPlan = async () => {
      try {
        // Fetch the session details from Stripe
        const res = await fetch(`/api/checkout_sessions?session_id=${sessionId}`);
        const session = await res.json();

        if (res.ok && session.payment_status === 'paid') {
          // Update the user's plan in Clerk
          const updateRes = await fetch('/api/update-user-plan', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.id, plan: 'Pro Plan' }),
          });

          if (!updateRes.ok) {
            throw new Error('Failed to update user plan.');
          }

          const updateData = await updateRes.json();
          if (updateData.error) {
            throw new Error(updateData.error);
          }

          console.log('User plan updated successfully.');
        } else {
          setError('Payment was not successful.');
        }
      } catch (err) {
        console.error('Error updating user plan:', err);
        setError('An error occurred while updating your plan.');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId && user) {
      updateUserPlan();
    }
  }, [sessionId, user]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Processing your purchase...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4">Thank you for your purchase!</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Your plan has been upgraded to Pro Plan.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          onClick={() => router.push('/')}
        >
          Return to Homepage
        </Button>
      </Box>
    </Container>
  );
}
