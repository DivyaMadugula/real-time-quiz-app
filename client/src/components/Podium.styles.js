import { styled, keyframes } from '@mui/material/styles';
import { Box, Paper, Typography, Avatar } from '@mui/material';

// --- ANIMATIONS ---
const sunburst = keyframes`
  from { transform: rotate(0deg); } to { transform: rotate(360deg); }
`;
const bounceIn = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  80% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
`;
const sparkle = keyframes`
  0%, 100% { box-shadow: 0 0 10px gold, 0 0 20px gold, 0 0 30px #fff; }
  50% { box-shadow: 0 0 20px gold, 0 0 30px gold, 0 0 40px #fff; }
`;

export const PodiumContainer = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
}));

export const SunburstBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '200vmax',
  height: '200vmax',
  background: `conic-gradient(from 90deg at 50% 50%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 5%, rgba(255, 255, 255, 0) 100%)`,
  transform: 'translate(-50%, -50%)',
  animation: `${sunburst} 40s linear infinite`,
  zIndex: 1,
}));

export const PodiumTitle = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontWeight: 'bold',
  textShadow: '3px 3px 10px rgba(0,0,0,0.5)',
  zIndex: 2,
  marginBottom: theme.spacing(4),
}));

export const PodiumStand = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  gap: theme.spacing(2),
  zIndex: 2,
}));

export const PlayerCard = styled(Paper)(({ theme, rank }) => ({
  width: '220px',
  padding: theme.spacing(2),
  textAlign: 'center',
  borderRadius: '20px',
  border: '2px solid',
  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  animation: `${bounceIn} 0.6s ease-out forwards`,
  
  ...(rank === 1 && {
    order: 2, minHeight: '280px',
    borderColor: 'gold',
    background: 'linear-gradient(145deg, #fff, #fff9c4)',
    animationDelay: '0.6s', // Appears last
    animationName: `${bounceIn}, ${sparkle}`,
    animationDuration: '0.6s, 1.5s',
    animationIterationCount: '1, infinite',
    animationTimingFunction: 'ease-out, ease-in-out',
  }),
  ...(rank === 2 && {
    order: 1, minHeight: '220px',
    borderColor: 'silver',
    background: 'linear-gradient(145deg, #fafafa, #e0e0e0)',
    animationDelay: '0.3s', // Appears second
  }),
  ...(rank === 3 && {
    order: 3, minHeight: '200px',
    borderColor: '#CD7F32',
    background: 'linear-gradient(145deg, #fff3e0, #ffe0b2)',
    animationDelay: '0s', // Appears first
  }),
}));

export const PlayerAvatar = styled(Avatar)(({ theme, rank }) => ({
  width: 90,
  height: 90,
  margin: 'auto',
  marginBottom: theme.spacing(1.5),
  fontSize: '3rem',
  border: '4px solid',
  ...(rank === 1 && { borderColor: 'gold', backgroundColor: theme.palette.secondary.main }),
  ...(rank === 2 && { borderColor: 'silver', backgroundColor: theme.palette.primary.main }),
  ...(rank === 3 && { borderColor: '#CD7F32', backgroundColor: theme.palette.grey[500] }),
}));

export const UsernameText = styled(Typography)(({ theme, rank }) => ({
  fontWeight: 'bold',
  ...(rank === 1 && {
      background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
  })
}));