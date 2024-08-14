'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, AppBar, Toolbar } from '@mui/material';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

export default function Home() {
  const { user } = useUser(); // Use the hook at the top level of the component
  const [plan, setPlan] = useState('');

  useEffect(() => {
    if (user) {
      const userPlan = user.publicMetadata?.plan || 'Free Plan'; // Retrieve the plan from user metadata
      setPlan(userPlan);
    }
  }, [user]);

  async function handleCheckout() {
    if (!user) {
      // Redirect to sign-in page with a query parameter for redirection after sign-in
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
          priceId: 'price_1PnRP1IOhsX2NmFQfzyhTu8C', // Replace with your actual price ID from Stripe
          userId: user.id, // Pass the userId to Stripe
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      if (!url) {
        throw new Error('No URL returned from API');
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred while trying to process your request. Please try again.');
    }
  }

  function handleGetStarted() {
    if (!user) {
      // Redirect to sign-in page if the user is not signed in
      window.location.href = '/sign-in?redirect_to=generate';
    } else {
      // Redirect to the generate page
      window.location.href = '/generate';
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in" component={Link}>
              Login
            </Button>
            <Button color="inherit" href="/sign-up" component={Link}>
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
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
                onClick={handleCheckout} // Link to the handleCheckout function
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
                  onClick={handleCheckout} // Link to the handleCheckout function
                >
                  Go Pro
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
