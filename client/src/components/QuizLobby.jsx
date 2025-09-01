import React, { useState, useEffect, useCallback } from 'react';
import { socket } from '../socket';
import { Typography, ListItemIcon, ListItemText, Chip, Snackbar, Avatar } from '@mui/material';
import {
  LobbyViewContainer, LobbyCard, PlayerList, PlayerListItem, StartButton, ShareCodeBox,
  PlayerAvatar, WaitingText
} from './QuizLobby.styles';
import ReactHowler from 'react-howler';
import { motion, AnimatePresence } from 'framer-motion';
import CrownIcon from '@mui/icons-material/WorkspacePremium';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const QuizLobby = ({ quizCode, isHost, initialPlayers = [] }) => {
  const [players, setPlayers] = useState(initialPlayers);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);
  const [copied, setCopied] = useState(false);
  const [musicFileExists, setMusicFileExists] = useState(true);

  const avatarGradients = [
    'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
    'linear-gradient(45deg, #FFC107 30%, #FF9800 90%)',
    'linear-gradient(45deg, #9C27B0 30%, #E040FB 90%)',
  ];
  
  const playerEmojis = ['🚀', '⭐', '🎲', '🎨', '🧠', '🤖', '🦄', '🦁', '🦊', '🐼', '👾', '👽'];

  const getPlayerAvatar = (playerId) => {
    const idAsNumber = (playerId.charCodeAt(1) || 0) + (playerId.charCodeAt(2) || 0);
    const gradient = avatarGradients[idAsNumber % avatarGradients.length];
    const emoji = playerEmojis[idAsNumber % playerEmojis.length];
    return { gradient, emoji };
  };
  
  useEffect(() => {
    const onPlayerListUpdate = (playerList) => {
        // Only update if the list from the server is not empty
        if (playerList.length > 0) {
            setPlayers(playerList);
        }
    };
    const onQuizStarted = () => setIsPlayingMusic(false);
    
    socket.on('update-player-list', onPlayerListUpdate);
    socket.on('quiz-started', onQuizStarted);

    return () => {
      socket.off('update-player-list', onPlayerListUpdate);
      socket.off('quiz-started', onQuizStarted);
    };
  }, []);

  const handleStartQuiz = () => {
    setIsPlayingMusic(false);
    socket.emit('start-quiz', quizCode);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(quizCode);
    setCopied(true);
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particleOptions = {
      background: { color: { value: 'transparent' } },
      fpsLimit: 60,
      particles: {
          number: { value: 15, density: { enable: true, value_area: 800 } },
          color: { value: ["#ff6b81", "#4dabf7"] },
          shape: { type: ["circle", "star"] },
          opacity: { value: 0.5, random: true },
          size: { value: { min: 3, max: 7 }, random: true },
          move: { enable: true, speed: 1.5, direction: "none", random: true, straight: false, out_mode: "out" }
      },
      interactivity: { events: { onhover: { enable: true, mode: "bubble" } } },
      detectRetina: true
  };

  const playerItemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <LobbyViewContainer>
      <Particles id="tsparticles-lobby" init={particlesInit} options={particleOptions} style={{ position: 'absolute', zIndex: 1 }} />
      <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, color: '#2d3436' }}>
        Get Ready!
      </Typography>
      <LobbyCard>
        {musicFileExists && (
          <ReactHowler
            src={['/audio/lobby-music.mp3']}
            playing={isPlayingMusic}
            loop={true}
            volume={0.3}
            onLoadError={() => {
              console.warn("Could not load music file. Make sure /public/audio/lobby-music.mp3 exists.");
              setMusicFileExists(false);
            }}
          />
        )}
        <Typography variant="h5">Join with Game Code:</Typography>
        <ShareCodeBox onClick={handleCopyToClipboard}>
          <Typography variant="h5" sx={{ letterSpacing: '3px', fontWeight: 'bold', mr: 2 }}>
            {quizCode}
          </Typography>
          <ContentCopyIcon fontSize="medium" />
        </ShareCodeBox>
        <Typography variant="h5">Players ({players.length}):</Typography>
        <PlayerList>
          <AnimatePresence>
            {players.map((player, index) => {
              const avatar = getPlayerAvatar(player.id);
              return (
                <motion.div key={player.id} variants={playerItemVariants} initial="hidden" animate="visible" exit="exit" layout>
                  <PlayerListItem>
                    <ListItemIcon>
                      <PlayerAvatar gradient={avatar.gradient} sx={{ fontSize: '1.5rem' }}>
                        {avatar.emoji}
                      </PlayerAvatar>
                    </ListItemIcon>
                    <ListItemText primary={player.username} primaryTypographyProps={{ fontSize: '1.2rem', fontWeight: '500' }} />
                    {isHost && index === 0 && (<Chip icon={<CrownIcon />} label="Host" color="secondary" size="small" sx={{ ml: 'auto' }} />)}
                  </PlayerListItem>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </PlayerList>
        {isHost ? (
          <StartButton variant="contained" onClick={handleStartQuiz}>Start Game!</StartButton>
        ) : (
          <WaitingText>
            Waiting for Host to start
          </WaitingText>
        )}
      </LobbyCard>
      <Snackbar open={copied} onClose={() => setCopied(false)} autoHideDuration={2000} message="Code copied to clipboard!" />
    </LobbyViewContainer>
  );
};

export default QuizLobby;