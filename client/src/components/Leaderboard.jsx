import React from 'react';
import { Typography, Box } from '@mui/material';
import CountUp from 'react-countup'; // Import the new library
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'; // Fire icon for streaks
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Trophy icon

import {
  LeaderboardContainer,
  PlayerRow,
  PlayerInfo,
  Rank,
  PlayerAvatar,
  ScoreContainer,
} from './Leaderboard.styles';

const Leaderboard = ({ players, isFinal = false }) => {
  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));

  const getRankColor = (rank) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return '#CD7F32'; // Bronze
    return 'inherit';
  };

  return (
    <LeaderboardContainer elevation={3}>
      <Typography variant="h5" textAlign="center" gutterBottom fontWeight="bold">
        {isFinal ? '🏆 Final Results 🏆' : 'Leaderboard'}
      </Typography>

      {sortedPlayers.map((player, index) => {
        const rank = index + 1;
        return (
          <PlayerRow key={player.id} rank={rank}>
            <PlayerInfo>
              <Rank sx={{ color: getRankColor(rank) }}>{rank}</Rank>
              <PlayerAvatar>{player.username.charAt(0).toUpperCase()}</PlayerAvatar>
              <Typography noWrap fontWeight="500">{player.username}</Typography>
            </PlayerInfo>

            <ScoreContainer>
              {player.streak > 1 && (
                <Box display="flex" alignItems="center" sx={{ color: 'orange', mr: 1 }}>
                  <LocalFireDepartmentIcon fontSize="small" />
                  <Typography variant="body2" fontWeight="bold">{player.streak}</Typography>
                </Box>
              )}
              <CountUp
                start={player.score > 10 ? player.score - 10 : 0} // Start from previous score
                end={player.score || 0}
                duration={1.5}
                separator=","
              />
              <Typography sx={{ ml: 0.5 }}>pts</Typography>
            </ScoreContainer>
          </PlayerRow>
        );
      })}
    </LeaderboardContainer>
  );
};

export default Leaderboard;