'use client';

import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Header() {
  return (
    <AppBar position="static">
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
          <UserButton />
        </SignedIn>
      </Toolbar>
    </AppBar>
  );
}
