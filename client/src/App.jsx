import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import CreateQuiz from './components/CreateQuiz';
import JoinQuiz from './components/JoinQuiz';
import QuizLobby from './components/QuizLobby';
import QuizView from './components/QuizView';
import Leaderboard from './components/Leaderboard'; // For the final screen

function App() {
  const [view, setView] = useState('home');
  const [quizInfo, setQuizInfo] = useState(null);
  const [username, setUsername] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [finalScores, setFinalScores] = useState([]);

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
    const hostUsername = prompt("Enter your username as host:") || "Host";
    setUsername(hostUsername);
    setQuizInfo(quizData);
    setIsHost(true);
    socket.emit('join-quiz', { username: hostUsername, quizCode: quizData.joinCode });
    setView('lobby');
  };

  const handleQuizJoined = (joinData) => {
    setUsername(joinData.username);
    setQuizInfo({ joinCode: joinData.quizCode });
    setIsHost(false); // A joining user is never the host
    setView('lobby');
  };

  const renderView = () => {
    switch (view) {
      case 'results':
        return (
          <div style={{ textAlign: 'center' }}>
            <h2>Quiz Over!</h2>
            <h3>Final Scores:</h3>
            <Leaderboard players={finalScores} />
          </div>
        );
      case 'quiz':
        return <QuizView quizCode={quizInfo.joinCode} username={username} isHost={isHost} />;
      case 'lobby':
        return <QuizLobby quizCode={quizInfo.joinCode} isHost={isHost} />;
      default:
        return (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <CreateQuiz onQuizCreated={handleQuizCreated} />
            <JoinQuiz onQuizJoined={handleQuizJoined} />
          </div>
        );
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Real-Time AI Quiz Generator</h1>
      <hr />
      {renderView()}
    </div>
  );
}
export default App;