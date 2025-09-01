// import React from 'react';
// import { Typography } from '@mui/material';
// import Confetti from 'react-confetti';
// import useWindowSize from 'react-use/lib/useWindowSize';
// import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// import {
//   PodiumContainer,
//   SunburstBackground,
//   PodiumTitle,
//   PodiumStand,
//   PlayerCard,
//   PlayerAvatar,
//   UsernameText,
// } from './Podium.styles';

// const Podium = ({ players }) => {
//   const { width, height } = useWindowSize();
//   const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  
//   // Create a podium array with rank information, ensuring it's always length 3
//   const podiumPlayers = [
//     sortedPlayers[0] ? { ...sortedPlayers[0], rank: 1 } : null,
//     sortedPlayers[1] ? { ...sortedPlayers[1], rank: 2 } : null,
//     sortedPlayers[2] ? { ...sortedPlayers[2], rank: 3 } : null,
//   ];

//   return (
//     <PodiumContainer>
//       <SunburstBackground />
//       <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />

//       <PodiumTitle variant="h1">
//         FINAL RESULTS
//       </PodiumTitle>

//       <PodiumStand>
//         {/* Map over the podium array to render cards */}
//         {podiumPlayers.map((player, index) => {
//           // Re-order for display: 2nd, 1st, 3rd
//           const displayOrder = [1, 0, 2];
//           const playerToDisplay = podiumPlayers[displayOrder[index]];

//           if (!playerToDisplay) return null; // Don't render a card if no player exists for that rank

//           return (
//             <PlayerCard key={playerToDisplay.id} rank={playerToDisplay.rank}>
//               <EmojiEventsIcon sx={{ fontSize: 40, color: playerToDisplay.rank === 1 ? 'gold' : playerToDisplay.rank === 2 ? 'silver' : '#CD7F32' }} />
//               <PlayerAvatar rank={playerToDisplay.rank}>
//                 {playerToDisplay.username.charAt(0).toUpperCase()}
//               </PlayerAvatar>
//               <UsernameText variant="h5" rank={playerToDisplay.rank}>{playerToDisplay.username}</UsernameText>
//               <Typography variant="h6" color="text.secondary">{playerToDisplay.score || 0} pts</Typography>
//             </PlayerCard>
//           );
//         })}
//       </PodiumStand>
//     </PodiumContainer>
//   );
// };

// export default Podium;
import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { socket } from '../socket'; // Import socket

import {
  PodiumContainer, SunburstBackground, PodiumTitle, PodiumStand,
  PlayerCard, PlayerAvatar, UsernameText
} from './Podium.styles';

const Podium = ({ players, isHost, quizCode }) => {
  const { width, height } = useWindowSize();
  const topThree = [...players].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 3);
  
  const podiumPlayers = [
    { ...topThree[1], rank: 2 },
    { ...topThree[0], rank: 1 },
    { ...topThree[2], rank: 3 },
  ].filter(p => p.username);

  const cardVariants = { /* ... */ };

  // --- NEW HANDLER ---
  const handlePlayAgain = () => {
    socket.emit('play-again-request', quizCode);
  };

  return (
    <PodiumContainer>
      <SunburstBackground />
      <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, duration: 0.5 }}>
        <PodiumTitle variant="h1">FINAL RESULTS</PodiumTitle>
      </motion.div>
      <PodiumStand>
        {podiumPlayers.map((player, i) => (
          <motion.div key={player.id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
            <PlayerCard rank={player.rank}>
              <EmojiEventsIcon sx={{ fontSize: 40, color: player.rank === 1 ? 'gold' : player.rank === 2 ? 'silver' : '#CD7F32' }} />
              <PlayerAvatar rank={player.rank}>{player.username.charAt(0).toUpperCase()}</PlayerAvatar>
              <UsernameText variant="h5" rank={player.rank}>{player.username}</UsernameText>
              <Typography variant="h6" color="text.secondary">{player.score || 0} pts</Typography>
            </PlayerCard>
          </motion.div>
        ))}
      </PodiumStand>

      {/* --- NEW BUTTON for the host --- */}
      {isHost && (
        <Box textAlign="center" mt={4}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
            <Button variant="contained" size="large" onClick={handlePlayAgain} sx={{ borderRadius: '50px' }}>
              Play Again
            </Button>
          </motion.div>
        </Box>
      )}
    </PodiumContainer>
  );
};

export default Podium;