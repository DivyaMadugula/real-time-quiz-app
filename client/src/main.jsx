import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import the new font
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';

// --- NEW LIGHT & MODERN THEME ---
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4dabf7', // 🌊 Sky Blue
    },
    secondary: {
      main: '#ff6b81', // 🌸 Light Pink / Coral
    },
    text: {
      primary: '#2d3436', // Dark Gray for primary text
    },
    background: {
      default: '#fdfbfb', // Fallback background color
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif', // Set Poppins as the default font
  },
  components: {
    MuiButton: {
        styleOverrides: {
            root: {
                textTransform: 'none', // Buttons will use normal case, not UPPERCASE
                fontWeight: 'bold',
            }
        }
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);