'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Button, Container, Grid, AppBar, Toolbar } from '@mui/material';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

function HomePageContent() {
  const { user } = useUser();
  const [plan, setPlan] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const planFromQuery = searchParams.get('plan');
    if (planFromQuery) {
      setPlan(planFromQuery);
    } else if (user) {
      const userPlan = user.publicMetadata?.plan || 'Free Plan';
      setPlan(userPlan);
    }
  }, [user, searchParams]);

  async function handleCheckout() {
    if (!user) {
      window.location.href = `/sign-in?redirect_to=checkout`;
      return;
    }

    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1PnlaNIOhsX2NmFQDgI9AkdX', // Replace with your actual price ID from Stripe
          userId: user.id, // Pass the userId along with the request
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      if (!url) {
        throw new Error('No URL returned from API');
      }

      window.location.href = url;
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred while trying to process your request. Please try again.');
    }
  }

  function handleGetStarted() {
    if (!user) {
      window.location.href = '/sign-in';
    } else {
      window.location.href = '/generate'; // Adjust this path according to where the user should go
    }
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to StudyBuddy AI
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create and manage flashcards for effective learning.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={handleGetStarted}>
            Get Started
          </Button>
          <Button variant="outlined" color="primary" href="/learn-more" component={Link}>
            Learn More
          </Button>
        </Box>
      </Container>

      <SignedIn>
        <Container maxWidth="lg" sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h5" component="h2">
            Your Current Plan: {plan}
          </Typography>
          {plan === 'Pro Plan' ? (
            <Typography variant="body1" color="success.main">
              You are enjoying the benefits of the Pro Plan!
            </Typography>
          ) : (
            <Box>
              <Typography variant="body1" color="warning.main" gutterBottom>
                You are currently on the Free Plan.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleCheckout}
              >
                Go Pro
              </Button>
            </Box>
          )}
        </Container>
      </SignedIn>

      <Container maxWidth="lg" sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                AI-Powered Flashcards
              </Typography>
              <Typography>
                Generate flashcards instantly using AI, making studying easier than ever.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Save and Organize
              </Typography>
              <Typography>
                Save your flashcards and organize them into sets for easy access and review.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Study Anywhere
              </Typography>
              <Typography>
                Access your flashcards on any device, anywhere, at any time.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Pricing
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <SignedOut>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 4, border: '1px solid', borderRadius: '8px', borderColor: 'grey.300' }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  Free Plan
                </Typography>
                <Typography>
                  Get started with basic features, including up to 10 flashcard sets.
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} href="/sign-up" component={Link}>
                  Sign Up for Free
                </Button>
              </Box>
            </Grid>
          </SignedOut>

          <SignedIn>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 4, border: '1px solid', borderRadius: '8px', borderColor: 'grey.300' }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  Pro Plan
                </Typography>
                <Typography>
                  Unlock all features with unlimited flashcard sets, AI-powered generation, and more.
                </Typography>
                {plan !== 'Pro Plan' && (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={handleCheckout}
                  >
                    Go Pro
                  </Button>
                )}
              </Box>
            </Grid>
          </SignedIn>
        </Grid>
      </Container>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
