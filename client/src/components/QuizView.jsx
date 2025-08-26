import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import Leaderboard from './Leaderboard';
import { QuizContainer, QuizCard, TimerBox, ActionButton, AnswerCard, AnswerIconWrapper } from './QuizView.styles';
import { Typography, CardContent, LinearProgress, Grid, Container, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SquareIcon from '@mui/icons-material/CropSquare';
import CircleIcon from '@mui/icons-material/PanoramaFishEye';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { motion, AnimatePresence } from 'framer-motion';
import ReactHowler from 'react-howler';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

const QuizView = ({ quizCode, isHost }) => {
  const answerStyles = [
    { color: '#e21b3c', icon: <ChangeHistoryIcon /> },
    { color: '#1368ce', icon: <FavoriteIcon /> },
    { color: '#d89e00', icon: <CircleIcon /> },
    { color: '#26890c', icon: <SquareIcon /> },
  ];

  const [soundToPlay, setSoundToPlay] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const [questionText, setQuestionText] = useState('');
  const [questionId, setQuestionId] = useState(null);
  const [options, setOptions] = useState([]);
  const [questionStage, setQuestionStage] = useState('waiting');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const TIME_PER_QUESTION = 60;

  useEffect(() => {
    const onShowQuestion = (questionData) => {
      setQuestionText(questionData.questionText);
      setQuestionId(questionData._id);
      setOptions([]);
      setResult(null);
      setHasAnswered(false);
      setTimeLeft(0);
      setQuestionStage('showing_question');
      setShowConfetti(false);
      setSoundToPlay(null);
    };
    const onShowAnswers = (answerData) => {
      setOptions(answerData.options);
      setTimeLeft(TIME_PER_QUESTION);
      setQuestionStage('showing_answers');
    };
    const onAnswerResult = ({ isCorrect }) => {
      setResult(isCorrect ? 'Correct!' : 'Incorrect!');
      if (isCorrect) {
        setSoundToPlay('correct');
        setShowConfetti(true);
      } else {
        setSoundToPlay('incorrect');
      }
    };
    const onPlayerListUpdate = (playerList) => setPlayers(playerList);
    const onShowLeaderboard = () => {
        setQuestionStage('leaderboard');
        setTimeout(() => setShowConfetti(false), 3000);
    };

    socket.on('show-question', onShowQuestion);
    socket.on('show-answers', onShowAnswers);
    socket.on('answer-result', onAnswerResult);
    socket.on('update-player-list', onPlayerListUpdate);
    socket.on('show-leaderboard', onShowLeaderboard);

    return () => {
      socket.off('show-question', onShowQuestion);
      socket.off('show-answers', onShowAnswers);
      socket.off('answer-result', onAnswerResult);
      socket.off('update-player-list', onPlayerListUpdate);
      socket.off('show-leaderboard', onShowLeaderboard);
    };
  }, []);

  useEffect(() => {
    if (questionStage !== 'showing_answers' || hasAnswered || timeLeft === 0) return;
    const timerId = setTimeout(() => {
        const newTime = timeLeft - 1;
        setTimeLeft(newTime);
        if (newTime <= 0) {
            handleAnswerSubmit();
        }
    }, 1000);
    return () => clearTimeout(timerId);
  }, [questionStage, hasAnswered, timeLeft]);

  const handleAnswerSubmit = () => {
    if (hasAnswered) return;
    setHasAnswered(true);
    socket.emit('submit-answer', { quizCode, answer: selectedAnswer, timeLeft });
  };

  const handleNextQuestion = () => {
    socket.emit('next-question-request', quizCode);
  };

  if (questionStage === 'waiting') {
    return <Container><Typography variant="h4" align="center" mt={5}>Quiz is starting...</Typography></Container>;
  }

  if (questionStage === 'leaderboard') {
    return (
        <QuizContainer maxWidth="md">
            <Typography variant="h3" textAlign="center" gutterBottom sx={{ color: 'white', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
              Leaderboard
            </Typography>
            <Leaderboard players={players} />
            {isHost && (
                <Box textAlign="center" mt={4}>
                    <ActionButton variant="contained" color="secondary" onClick={handleNextQuestion}>
                        Next Question
                    </ActionButton>
                </Box>
            )}
        </QuizContainer>
    );
  }

  return (
    <QuizContainer maxWidth="lg">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />}
      <ReactHowler
        src={soundToPlay === 'correct' ? '/audio/correct-answer.mp3' : '/audio/incorrect-answer.mp3'}
        playing={!!soundToPlay} onEnd={() => setSoundToPlay(null)} volume={0.5}
      />
      <Grid container spacing={4} justifyContent="center">
        <Grid xs={12} md={8}>
          <motion.div
            animate={{ x: result === 'Incorrect!' ? [-5, 5, -5, 5, 0] : 0 }}
            transition={{ duration: 0.4 }}
          >
            <QuizCard elevation={3}>
              <CardContent sx={{ minHeight: 500, display: 'flex', flexDirection: 'column' }}>
                {questionStage === 'showing_answers' && (
                  <TimerBox>
                    <Typography variant="body2">Time Remaining: {timeLeft}s</Typography>
                    <LinearProgress variant="determinate" value={(timeLeft / TIME_PER_QUESTION) * 100} />
                  </TimerBox>
                )}
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={questionId}
                      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.5 }}
                    >
                      <Typography variant="h4" component="h2" textAlign="center">{questionText}</Typography>
                    </motion.div>
                  </AnimatePresence>
                </Box>
                {questionStage === 'showing_answers' && (
                  <AnimatePresence>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        {options.map((option, index) => (
                          <Grid xs={12} sm={6} key={option}>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <AnswerCard
                                elevation={3} selected={selectedAnswer === option}
                                bgcolor={answerStyles[index % 4].color}
                                onClick={() => !hasAnswered && setSelectedAnswer(option)}
                              >
                                <AnswerIconWrapper>{answerStyles[index % 4].icon}</AnswerIconWrapper>
                                <Typography variant="h6">{option}</Typography>
                              </AnswerCard>
                            </motion.div>
                          </Grid>
                        ))}
                      </Grid>
                      <Box textAlign="center" mt={2}>
                        {!hasAnswered && (
                          <ActionButton variant="contained" onClick={handleAnswerSubmit} disabled={!selectedAnswer}>
                            Lock In Answer
                          </ActionButton>
                        )}
                        {result && (
                          <Typography variant="h6" sx={{ mt: 2 }} color={result === 'Correct!' ? 'success.main' : 'error.main'}>
                            {result === 'Correct!' ? <CheckCircleIcon /> : <CancelIcon />} {' '}{result}
                          </Typography>
                        )}
                      </Box>
                    </motion.div>
                  </AnimatePresence>
                )}
              </CardContent>
            </QuizCard>
          </motion.div>
        </Grid>
      </Grid>
    </QuizContainer>
  );
};

export default QuizView;