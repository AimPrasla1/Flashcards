'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Header from '../app/components/header';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header /> 
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
