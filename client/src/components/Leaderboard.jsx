import React from 'react';

const Leaderboard = ({ players }) => {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}>
      <h4>Leaderboard</h4>
      <ol>
        {sortedPlayers.map(player => (
          <li key={player.id}>
            {player.username}: {player.score || 0} points
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;