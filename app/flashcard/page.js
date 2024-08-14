// app/flashcard/page.js
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { doc, getDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

export default function Flashcard() {
  const [flashcards, setFlashcards] = useState([]);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    const fetchFlashcards = async () => {
      const docRef = doc(collection(db, 'flashcardSets'), id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFlashcards(docSnap.data().flashcards);
      }
    };

    fetchFlashcards();
  }, [id]);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Flashcard Set
        </Typography>
        <Grid container spacing={2}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Question</Typography>
                  <Typography>{flashcard.front}</Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>Answer</Typography>
                  <Typography>{flashcard.back}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
