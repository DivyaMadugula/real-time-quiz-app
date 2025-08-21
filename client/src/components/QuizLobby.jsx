import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

// Now receives isHost as a prop
const QuizLobby = ({ quizCode, isHost }) => {
  const [players, setPlayers] = useState([]);
  
  useEffect(() => {
    const onPlayerListUpdate = (playerList) => setPlayers(playerList);
    socket.on('update-player-list', onPlayerListUpdate);
    return () => socket.off('update-player-list', onPlayerListUpdate);
  }, []);

  const handleStartQuiz = () => {
    socket.emit('start-quiz', quizCode);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Quiz Lobby</h2>
      <h3>Quiz Code: {quizCode}</h3>
      <h4>Players ({players.length}):</h4>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.username} {players[0].id === player.id ? '👑' : ''}
          </li>
        ))}
      </ul>
      {isHost && <button onClick={handleStartQuiz}>Start Quiz</button>}
    </div>
  );
};
export default QuizLobby;