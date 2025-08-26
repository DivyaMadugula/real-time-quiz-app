import { styled } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';

export const FormContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
}));

export const Subtitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: '12px 0',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  borderRadius: '50px',
  color: 'white',
  // Use the secondary (pink) color from our theme
  background: `linear-gradient(45deg, ${theme.palette.secondary.light} 30%, ${theme.palette.secondary.main} 90%)`,
  boxShadow: `0 4px 15px 0 ${theme.palette.secondary.main}40`, // Add a colored shadow
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `0 8px 25px 0 ${theme.palette.secondary.main}60`,
  },
}));

export const LoadingWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
}));