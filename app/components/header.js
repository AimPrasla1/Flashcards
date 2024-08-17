'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Header() {
  return (
    <AppBar position="static" sx={{ bgcolor: '#024950' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          StudyBuddy AI
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              sx={{
                color: 'white',
                bgcolor: 'transparent',
                '&:hover': {
                  bgcolor: '#AFDDE5',
                },
                marginRight: 2,
              }}
              href="/"
              component={Link}
            >
              Home
            </Button>
            <UserButton />
          </Box>
        </SignedIn>
      </Toolbar>
    </AppBar>
  );
}
