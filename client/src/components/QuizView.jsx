import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import Leaderboard from './Leaderboard';

const QuizView = ({ quizCode, username, isHost }) => {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [result, setResult] = useState(null); // 'correct' or 'incorrect'
  const [hasAnswered, setHasAnswered] = useState(false);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Event listeners
    const onNextQuestion = (questionData) => {
      setQuestion(questionData);
      setSelectedAnswer('');
      setResult(null);
      setHasAnswered(false);
    };

    const onAnswerResult = ({ isCorrect }) => {
      setResult(isCorrect ? 'Correct!' : 'Incorrect!');
    };
    
    const onPlayerListUpdate = (playerList) => {
      setPlayers(playerList);
    };

    socket.on('next-question', onNextQuestion);
    socket.on('answer-result', onAnswerResult);
    socket.on('update-player-list', onPlayerListUpdate);

    return () => {
      // Cleanup
      socket.off('next-question', onNextQuestion);
      socket.off('answer-result', onAnswerResult);
      socket.off('update-player-list', onPlayerListUpdate);
    };
  }, []);

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;
    setHasAnswered(true);
    socket.emit('submit-answer', { quizCode, answer: selectedAnswer });
  };

  const handleNextQuestion = () => {
    socket.emit('next-question-request', quizCode);
  };

  if (!question) {
    return <div><h2>Waiting for the quiz to start...</h2></div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div>
        <h3>{question.questionText}</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(option)}
              disabled={hasAnswered}
              style={{
                margin: '5px',
                padding: '10px',
                backgroundColor: selectedAnswer === option ? '#a0c4ff' : 'white'
              }}
            >
              {option}
            </button>
          ))}
        </div>
        <button onClick={handleAnswerSubmit} disabled={hasAnswered || !selectedAnswer}>
          Submit Answer
        </button>
        {result && <h3>{result}</h3>}
        {isHost && hasAnswered && (
          <button onClick={handleNextQuestion} style={{ marginTop: '10px' }}>
            Next Question
          </button>
        )}
      </div>
      <Leaderboard players={players} />
    </div>
  );
};

export default QuizView;