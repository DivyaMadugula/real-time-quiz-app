import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';

export const HomePageContainer = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative', // Necessary for child positioning
}));

export const ContentContainer = styled(Container)(({ theme }) => ({
  textAlign: 'center',
  position: 'relative',
  zIndex: 2, // Content is on layer 2
}));

export const MainTitle = styled(Typography)(({ theme }) => ({
  fontWeight: '700',
  marginBottom: theme.spacing(2),
  fontSize: 'clamp(3.5rem, 10vw, 6rem)',
  background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

export const Subtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(6),
  fontSize: 'clamp(1rem, 4vw, 1.5rem)',
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  fontSize: '1.2rem',
  padding: '15px 40px',
  borderRadius: '50px',
  margin: theme.spacing(1),
  color: 'white',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
  },
}));

export const CreateButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

export const JoinButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));