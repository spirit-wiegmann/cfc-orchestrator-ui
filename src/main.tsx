import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Material UI Theme mit Crownpeak Farbschema
const theme = createTheme({
  palette: {
    primary: {
      main: '#0073e6', // Crownpeak Blau
    },
    secondary: {
      main: '#6e40aa', // Crownpeak Lila
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

// Basisverzeichnis für GitHub Pages festlegen
const basename = import.meta.env.MODE === 'production' 
  ? '/cfc-orchestrator-ui' 
  : '/';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
