import { styled, keyframes } from '@mui/material/styles';
import { Box, Button, Card, CardContent, Container, Grid, Paper } from '@mui/material';

// --- NEW ANIMATION KEYFRAMES ---
const animatedGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const QuizContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  // --- NEW BACKGROUND STYLING ---
  background: `linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)`,
  backgroundSize: '400% 400%',
  animation: `${animatedGradient} 15s ease infinite`,
  borderRadius: '20px', // Rounded corners for the container
}));

export const QuizCard = styled(Card)(({ theme }) => ({
  boxShadow: '0px 10px 25px rgba(0,0,0,0.25)',
  borderRadius: '15px',
  // Make the card slightly transparent to see the background
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
}));

export const TimerBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: '10px 0',
  fontSize: '1rem',
  fontWeight: 'bold',
  borderRadius: '50px',
}));

export const AnswerCard = styled(Paper)(({ theme, selected, bgcolor }) => ({
  margin: theme.spacing(1, 0),
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  backgroundColor: bgcolor,
  color: theme.palette.common.white,
  border: selected ? `4px solid ${theme.palette.common.white}` : '4px solid transparent',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: `0 0 15px ${bgcolor}`,
  },
}));

export const AnswerIconWrapper = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
}));