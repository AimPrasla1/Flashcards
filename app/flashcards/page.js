'use client';

import { useEffect, useState } from 'react';
import { Container, Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { doc, collection, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUser } from '@clerk/nextjs';

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const fetchFlashcards = async () => {
      try {
        const docRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFlashcards(docSnap.data().flashcardSets || []);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };

    fetchFlashcards();
  }, [user]);

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => router.push(`/flashcard?id=${flashcard.id}`)}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {flashcard.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
