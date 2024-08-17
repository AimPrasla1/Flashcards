'use client';

import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import { db } from '../firebase'; // Import your Firebase setup
import { doc, setDoc } from 'firebase/firestore'; // Firebase Firestore

export default function Generate() {
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.');
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate flashcards');
      }

      const data = await response.json();

      if (data.length >= 6) {
        const newFlashcards = data.slice(0, 6);
        setFlashcards(newFlashcards);
        setFlipped({}); // Reset the flipped state
      } else {
        alert('The API did not return enough data to generate 6 flashcards.');
      }
    } catch (error) {
      console.error('Error generating flashcards:', error.message);
      alert('An error occurred while generating flashcards. Please try again.');
    }
  };

  const handleFlip = (index) => {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSave = async () => {
    if (flashcards.length === 0) {
      alert('No flashcards to save.');
      return;
    }

    try {
      const flashcardData = {
        flashcards,
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'flashcards', Date.now().toString()), flashcardData);
      alert('Flashcards saved successfully!');
    } catch (error) {
      console.error('Error saving flashcards:', error.message);
      alert('An error occurred while saving flashcards. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#AFDDE5', // Your desired background color
        minHeight: '100vh',  // Ensure it covers the full viewport height
        width: '100%',       // Ensure it covers the full viewport width
        padding: 0,          // Remove any padding
        margin: 0,           // Remove any margin
      }}
    >
      <Container maxWidth="md" sx={{ bgcolor: '#AFDDE5', minHeight: '100vh', color: 'white', py: 4 }}>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Generate Flashcards
          </Typography>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{
              mb: 2,
              bgcolor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#0FA4AF', // Border color of the input box
                },
                '&:hover fieldset': {
                  borderColor: '#0FA4AF', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0FA4AF', // Border color when focused
                },
              },
            }}
            InputProps={{
              style: { color: 'black' }, // Text inside the input box
            }}
            InputLabelProps={{
              style: { color: 'black' }, // Label (placeholder) color, stays black when focused
            }}
          />
          <Button
            variant="contained"
            sx={{
              bgcolor: '#0FA4AF',   // Button background color
              color: 'white',
              '&:hover': {
                bgcolor: '#024950', // Background color on hover
              },
              fullWidth: true,
            }}
            onClick={handleSubmit}
          >
            Generate Flashcards
          </Button>
        </Box>

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom textAlign="center">
              Generated Flashcards
            </Typography>
            <Grid container spacing={2}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ width: '100%', height: 200, bgcolor: '#0FA4AF' }}> {/* Flashcard background color */}
                    <CardActionArea
                      onClick={() => handleFlip(index)}
                      sx={{ height: '100%' }}
                    >
                      <CardContent
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center',
                          color: 'white', // Flashcard text color
                        }}
                      >
                        {flipped[index] ? (
                          <>
                            <Typography variant="h6">Answer</Typography>
                            <Typography>{flashcard.back}</Typography>
                          </>
                        ) : (
                          <>
                            <Typography variant="h6">Question</Typography>
                            <Typography>{flashcard.front}</Typography>
                          </>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: '#0FA4AF',   // Button background color
                color: 'white',
                '&:hover': {
                  bgcolor: '#024950', // Background color on hover
                },
                fullWidth: true,
              }}
              onClick={handleSave}
            >
              Save Flashcards
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
