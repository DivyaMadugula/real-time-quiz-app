import { styled } from '@mui/material/styles';
import { Box, Paper, Typography, Avatar } from '@mui/material';

export const LeaderboardContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  background: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
  display: 'flex',
  flexDirection: 'column',
}));

export const PlayerRow = styled(Box)(({ theme, rank }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  borderRadius: '10px',
  // Podium styling
  ...(rank === 1 && { background: 'rgba(255, 215, 0, 0.2)', border: '1px solid gold' }), // Gold
  ...(rank === 2 && { background: 'rgba(192, 192, 192, 0.2)', border: '1px solid silver' }), // Silver
  ...(rank === 3 && { background: 'rgba(205, 127, 50, 0.2)', border: '1px solid #CD7F32' }), // Bronze
}));

export const PlayerInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
}));

export const Rank = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  width: '40px',
  textAlign: 'center',
}));

export const PlayerAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  margin: theme.spacing(0, 1.5),
}));

export const ScoreContainer = styled(Box)(({ theme }) => ({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
  fontSize: '1.2rem',
}));