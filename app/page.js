'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import Link from 'next/link';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';

function HomePageContent() {
  const { user } = useUser();
  const [plan, setPlan] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const [visibleFeatures, setVisibleFeatures] = useState([false, false, false]);
  const [visiblePricing, setVisiblePricing] = useState(false);
  const featureRefs = [useRef(null), useRef(null), useRef(null)];
  const pricingRef = useRef(null);

  useEffect(() => {
    const planFromQuery = searchParams.get('plan');
    if (planFromQuery) {
      setPlan(planFromQuery);
    } else if (user) {
      const userPlan = user.publicMetadata?.plan || 'Free Plan';
      setPlan(userPlan);
    }
  }, [user, searchParams]);

  useEffect(() => {
    if (plan === 'Pro Plan') {
      router.refresh();
    }
  }, [plan, router]);

  useEffect(() => {
    const featureObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          setVisibleFeatures((prev) => {
            const updated = [...prev];
            updated[index] = entry.isIntersecting;
            return updated;
          });
        });
      },
      { threshold: 0.1 }
    );

    featureRefs.forEach((ref) => {
      if (ref.current) {
        featureObserver.observe(ref.current);
      }
    });

    return () => {
      featureRefs.forEach((ref) => {
        if (ref.current) {
          featureObserver.unobserve(ref.current);
        }
      });
    };
  }, [featureRefs]);

  useEffect(() => {
    const pricingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisiblePricing(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    if (pricingRef.current) {
      pricingObserver.observe(pricingRef.current);
    }

    return () => {
      if (pricingRef.current) {
        pricingObserver.unobserve(pricingRef.current);
      }
    };
  }, [pricingRef]);

  const handleCheckout = async () => {
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
          priceId: 'price_1PnlaNIOhsX2NmFQDgI9AkdX',
          userId: user.id,
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
  };

  const handleGetStarted = () => {
    if (!user) {
      window.location.href = '/sign-in';
    } else {
      window.location.href = '/generate';
    }
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: '#0FA4AF',
          minHeight: '100vh',
          paddingTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h2" component="h1" marginBottom={2} color="white">
            Welcome to StudyBuddy AI
          </Typography>
          <Typography variant="h5" component="h2" marginBottom={3} color="white">
            Your new home for creating and managing flashcards for effective learning.
          </Typography>
          <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              mr: 2,
              bgcolor: 'white',
              color: '#024950',
              '&:hover': {
                bgcolor: '#AFDDE5',
              },
            }}
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
          
          {plan !== 'Pro Plan' && (
            <Button
              variant="contained"
              sx={{
                bgcolor: 'white',
                color: '#024950',
                '&:hover': {
                  bgcolor: '#afdde5',
                },
              }}
              onClick={handleCheckout}
            >
              Go Pro
            </Button>
          )}
          </Box>
          <SignedIn>
            <Container maxWidth="lg" sx={{ textAlign: 'center', my: 4 }}>
              {plan === 'Pro Plan' ? (
                <Typography variant="body1" color="White">
                  You are enjoying the benefits of the Pro Plan!
                </Typography>
              ) : (
                <Box>
                  <Typography variant="body1" color="White" marginBottom={15}>
                    You are currently on the Free Plan.
                  </Typography>
                </Box>
              )}
            </Container>
          </SignedIn>
        </Container>
      </Box>

      <Box
        sx={{
          bgcolor: '#0FA4AF',
          paddingY: 1,
          width: '100%',
          color: 'WHITE',
        }}
      >
        <Container maxWidth="lg" sx={{ my: 6 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
            Features
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: 'AI-Powered Flashcards',
                description: 'Generate flashcards instantly using AI, making studying easier than ever',
                image: '/ai.png',
              },
              {
                title: 'Save and Organize',
                description: 'Save your flashcards and organize them into sets for easy access and review',
                image: '/organize.png',
              },
              {
                title: 'Study Anywhere',
                description: 'Seamlessly access and study your flashcards wherever you are, at any time',
                image: '/study.png',
              },
            ].map(({ title, description, image}, index) => (
              <Grid item xs={12} key={title} ref={featureRefs[index]}>
                <Box
                  sx={{
                    textAlign: { xs: 'center', md: index % 2 === 0 ? 'left' : 'right' },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    opacity: visibleFeatures[index] ? 1 : 0,
                    transform: visibleFeatures[index] ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 1s, transform 1s',
                    marginTop: 15,
                    marginBottom: 25,
                  }}
                >
                  <Box
                    component="img"
                    src={image}
                    alt={`Image for ${title}`}
                    sx={{
                      order: { xs: 2, md: 1 },
                      width: '50%',
                      height: 200,
                      objectFit: 'contain',
                      margin: '15',
                      filter: 'brightness(0) invert(1)',
                    }}
                  />
                  <Box sx={{ order: { xs: 1, md: 2 }, width: '100%' }}>
                    <Typography variant="h4" component="h4" gutterBottom>
                      {title}
                    </Typography>

                    <Typography variant="h6">{description}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          width: '100%',
          bgcolor: '#0FA4AF',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          paddingBottom: 35,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            textAlign: 'center',
            bgcolor: '#0FA4AF',
            color: 'white',
            padding: 4,
            margin: 0,
            borderRadius: '8px',
            opacity: visiblePricing ? 1 : 0,
            transform: visiblePricing ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s, transform 1s',
          }}
          ref={pricingRef}
        >
          <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'white', paddingTop: 4, paddingBottom: 5 }}>
            Pricing
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            <SignedOut>
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    p: 4,
                    height: '100%',
                    border: '1px solid white',
                    borderRadius: '8px',
                    bgcolor: '#0FA4AF',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: 'white' }}>
                    Free Plan
                  </Typography>
                  <Typography sx={{ color: 'white', flexGrow: 1 }}>
                    Get started with basic features, including up to 10 flashcard sets.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      bgcolor: 'white',
                      color: '#0FA4AF',
                      '&:hover': {
                        bgcolor: '#AFDDE5',
                      },
                    }}
                    href="/sign-up"
                    component={Link}
                  >
                    Sign Up for Free
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    p: 4,
                    height: '100%',
                    border: '1px solid white',
                    borderRadius: '8px',
                    bgcolor: '#0FA4AF',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: 'white' }}>
                    Pro Plan
                  </Typography>
                  <Typography sx={{ color: 'white', flexGrow: 1 }}>
                    Unlock all features with unlimited flashcard sets, AI-powered generation, and more.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      bgcolor: 'white',
                      color: '#0FA4AF',
                      '&:hover': {
                        bgcolor: '#AFDDE5',
                      },
                    }}
                    href="/sign-up"
                    component={Link}
                  >
                    Go Pro
                  </Button>
                </Box>
              </Grid>
            </SignedOut>

            <SignedIn>
              {plan !== 'Pro Plan' ? (
                <Grid item xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      p: 4,
                      height: '100%',
                      border: '1px solid white',
                      borderRadius: '8px',
                      bgcolor: '#0FA4AF',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="h5" component="h3" gutterBottom sx={{ color: 'white' }}>
                      Pro Plan
                    </Typography>
                    <Typography sx={{ color: 'white', flexGrow: 1 }}>
                      Unlock all features with unlimited flashcard sets, AI-powered generation, and more.
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                        bgcolor: 'white',
                        color: '#0FA4AF',
                        '&:hover': {
                          bgcolor: '#AFDDE5',
                        },
                      }}
                      onClick={handleCheckout}
                    >
                      Go Pro
                    </Button>
                  </Box>
                </Grid>
              ) : (
                <Grid item xs={12} sm={6} md={4}>
      <Box
        sx={{
          p: 4,
          height: '100%',
          border: '1px solid white',
          borderRadius: '8px',
          bgcolor: '#0FA4AF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" component="h3" sx={{ color: 'white' }}>
          You are enjoying the benefits of the Pro Plan!
        </Typography>
        <Typography sx={{ color: 'white' }}>Thank you for your purchase.</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{
            mt: 2,
            bgcolor: 'white',
            color: '#0FA4AF',
            '&:hover': {
              bgcolor: '#AFDDE5', 
            },
          }}
          href="/generate"
          component={Link}
        >
          Generate
        </Button>

      </Box>
                </Grid>
              )}
            </SignedIn>
          </Grid>
        </Container>
      </Box>
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
