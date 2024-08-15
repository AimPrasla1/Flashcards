// app/flashcards/page.js
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Container, Typography, Grid, Card, CardContent, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function FlashcardsPage() {
  const { user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!user) return;

      try {
        const res = await fetch(`/api/flashcards?userId=${user.id}`);
        const data = await res.json();

        if (res.ok) {
          setFlashcards(data.flashcards);
        } else {
          setError(data.error);
        }
      } catch (err) {
        console.error('Error fetching flashcards:', err);
        setError('Failed to load flashcards.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [user]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">Loading flashcards...</Typography>
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

  if (flashcards.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">You have no saved flashcards.</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => router.push('/generate')}>
          Generate Flashcards
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Flashcards
      </Typography>
      <Grid container spacing={4}>
        {flashcards.map((flashcard) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{flashcard.front}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {flashcard.back}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
