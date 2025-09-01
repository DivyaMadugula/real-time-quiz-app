import { styled, keyframes } from '@mui/material/styles';
import { Box, Button, Paper, List, ListItem, Avatar } from '@mui/material';

export const LobbyViewContainer = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  padding: theme.spacing(2),
}));

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7); }
  70% { transform: scale(1.02); box-shadow: 0 0 10px 20px rgba(46, 204, 113, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(46, 204, 113, 0); }
`;

export const LobbyCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3, 4),
  width: '100%',
  maxWidth: '600px',
  textAlign: 'center',
  background: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
  zIndex: 2,
}));

export const ShareCodeBox = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1.5, 3),
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '50px',
  cursor: 'pointer',
  boxShadow: `0 4px 15px 0 ${theme.palette.primary.main}40`,
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

export const PlayerList = styled(List)(({ theme }) => ({
  marginTop: theme.spacing(2),
  maxHeight: '250px',
  overflowY: 'auto',
  paddingRight: theme.spacing(1),
}));

export const PlayerListItem = styled(ListItem)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5))',
  borderRadius: '12px',
  marginBottom: theme.spacing(1.5),
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(1, 2),
}));

export const PlayerAvatar = styled(Avatar)(({ gradient }) => ({
  background: gradient,
  width: 40,
  height: 40,
  fontWeight: 'bold',
  color: 'white',
}));

export const StartButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: '15px 40px',
  fontSize: '1.4rem',
  borderRadius: '50px',
  backgroundColor: '#2ecc71',
  color: 'white',
  boxShadow: '0px 4px 15px rgba(46, 204, 113, 0.4)',
  '&:hover': {
    backgroundColor: '#27ae60',
  },
  animation: `${pulse} 2s infinite ease-in-out`,
}));

// --- THIS IS THE CORRECTED KEYFRAME ANIMATION ---
const dots = keyframes`
    0%, 20% { content: '"."'; }
    40% { content: '".."'; }
    60% { content: '"..."'; }
    80%, 100% { content: '""'; }
`;

export const WaitingText = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  color: theme.palette.text.secondary,
  fontSize: '1.1rem',
  '&::after': {
    display: 'inline-block',
    content: '""',
    animation: `${dots} 2s infinite`,
    width: '20px',
    textAlign: 'left',
  },
}));