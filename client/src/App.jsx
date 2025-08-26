import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { Box, Modal } from '@mui/material';

import HomePage from './components/HomePage';
import CreateQuiz from './components/CreateQuiz';
import JoinQuiz from './components/JoinQuiz';
import QuizLobby from './components/QuizLobby';
import QuizView from './components/QuizView';
import Podium from './components/Podium'; // Import the new Podium component

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  
  // --- FROSTED GLASS EFFECT ---
  background: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
  
  p: 4, // Padding
};

function App() {
  const [view, setView] = useState('home');
  const [quizInfo, setQuizInfo] = useState(null);
  const [username, setUsername] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [finalScores, setFinalScores] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);

  useEffect(() => {
    function onQuizStarted() { setView('quiz'); }
    function onQuizOver(finalPlayerList) {
      setFinalScores(finalPlayerList);
      setView('results');
    }
    socket.on('quiz-started', onQuizStarted);
    socket.on('quiz-over', onQuizOver);
    return () => {
      socket.off('quiz-started', onQuizStarted);
      socket.off('quiz-over', onQuizOver);
    };
  }, []);

  const handleQuizCreated = (quizData) => {
    setOpenCreateModal(false);
    const hostUsername = prompt("Enter your username as host:") || "Host";
    setUsername(hostUsername);
    setQuizInfo(quizData);
    setIsHost(true);
    socket.emit('join-quiz', { username: hostUsername, quizCode: quizData.joinCode });
    setView('lobby');
  };

  const handleQuizJoined = (joinData) => {
    setOpenJoinModal(false);
    setUsername(joinData.username);
    setQuizInfo({ joinCode: joinData.joinCode });
    setIsHost(false);
    setView('lobby');
  };

  const renderView = () => {
    switch (view) {
      case 'results':
        return <Podium players={finalScores} />; // Use the Podium component here
      case 'quiz':
        return <QuizView quizCode={quizInfo.joinCode} isHost={isHost} />;
      case 'lobby':
        return <QuizLobby quizCode={quizInfo.joinCode} isHost={isHost} />;
      default:
        return (
          <HomePage
            onCreateClick={() => setOpenCreateModal(true)}
            onJoinClick={() => setOpenJoinModal(true)}
          />
        );
    }
  };

  return (
    <Box>
      {renderView()}
      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Box sx={modalStyle}><CreateQuiz onQuizCreated={handleQuizCreated} /></Box>
      </Modal>
      <Modal open={openJoinModal} onClose={() => setOpenJoinModal(false)}>
        <Box sx={modalStyle}><JoinQuiz onQuizJoined={handleQuizJoined} /></Box>
      </Modal>
    </Box>
  );
}

export default App;