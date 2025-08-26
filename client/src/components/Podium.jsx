import React from 'react';
import { Typography } from '@mui/material';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import {
  PodiumContainer,
  SunburstBackground,
  PodiumTitle,
  PodiumStand,
  PlayerCard,
  PlayerAvatar,
  UsernameText,
} from './Podium.styles';

const Podium = ({ players }) => {
  const { width, height } = useWindowSize();
  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  
  // Create a podium array with rank information, ensuring it's always length 3
  const podiumPlayers = [
    sortedPlayers[0] ? { ...sortedPlayers[0], rank: 1 } : null,
    sortedPlayers[1] ? { ...sortedPlayers[1], rank: 2 } : null,
    sortedPlayers[2] ? { ...sortedPlayers[2], rank: 3 } : null,
  ];

  return (
    <PodiumContainer>
      <SunburstBackground />
      <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />

      <PodiumTitle variant="h1">
        FINAL RESULTS
      </PodiumTitle>

      <PodiumStand>
        {/* Map over the podium array to render cards */}
        {podiumPlayers.map((player, index) => {
          // Re-order for display: 2nd, 1st, 3rd
          const displayOrder = [1, 0, 2];
          const playerToDisplay = podiumPlayers[displayOrder[index]];

          if (!playerToDisplay) return null; // Don't render a card if no player exists for that rank

          return (
            <PlayerCard key={playerToDisplay.id} rank={playerToDisplay.rank}>
              <EmojiEventsIcon sx={{ fontSize: 40, color: playerToDisplay.rank === 1 ? 'gold' : playerToDisplay.rank === 2 ? 'silver' : '#CD7F32' }} />
              <PlayerAvatar rank={playerToDisplay.rank}>
                {playerToDisplay.username.charAt(0).toUpperCase()}
              </PlayerAvatar>
              <UsernameText variant="h5" rank={playerToDisplay.rank}>{playerToDisplay.username}</UsernameText>
              <Typography variant="h6" color="text.secondary">{playerToDisplay.score || 0} pts</Typography>
            </PlayerCard>
          );
        })}
      </PodiumStand>
    </PodiumContainer>
  );
};

export default Podium;