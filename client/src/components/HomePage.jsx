import React from 'react';
import { useCallback } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import RobotMascot from '../assets/robot-mascot.svg';
import {
  HomePageContainer,
  ContentContainer,
  MainTitle,
  Subtitle,
  CreateButton,
  JoinButton,
} from './HomePage.styles';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

const HomePage = ({ onCreateClick, onJoinClick }) => {
  // --- THIS IS THE CORRECT SYNTAX FOR VERSION 2 ---
  const particlesInit = useCallback(async (engine) => {
    // This loads the full engine for emoji support, etc.
    await loadFull(engine);
  }, []);

  const particleOptions = {
    background: {
      color: { value: 'transparent' },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'bubble' },
      },
      modes: {
        bubble: { distance: 200, duration: 2, opacity: 0.8, size: 20 },
      },
    },
    particles: {
      color: { value: ["#ff6b81", "#4dabf7", "#ffeaa7"] },
      links: { enable: false },
      move: {
        direction: 'top',
        enable: true,
        outModes: { default: 'out' },
        random: true,
        speed: 1,
        straight: false,
      },
      number: { density: { enable: true, area: 800 }, value: 20 },
      opacity: { value: { min: 0.3, max: 0.7 } },
      shape: {
        type: ['circle', 'star', 'character'],
        character: [
          { value: '⭐', style: "", weight: "400", fill: true },
          { value: '❓', style: "", weight: "400", fill: true },
          { value: '🎮', style: "", weight: "400", fill: true },
          { value: '🧠', style: "", weight: "400", fill: true },
        ],
      },
      size: { value: { min: 10, max: 25 } },
    },
    detectRetina: true,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <HomePageContainer>
      <Particles
        id="tsparticles-home"
        init={particlesInit} // Use the init prop
        options={particleOptions}
        style={{ position: 'absolute', zIndex: 1 }}
      />
      
      <ContentContainer>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants}>
            <MainTitle variant="h1">QuizSpark AI</MainTitle>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Subtitle variant="h5">AI-Powered Quizzes. Real-Time Fun.</Subtitle>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Box>
              <motion.div whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} style={{ display: 'inline-block' }}>
                <CreateButton variant="contained" onClick={onCreateClick} startIcon={<AddCircleOutlineIcon />}>
                  Create Quiz
                </CreateButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} style={{ display: 'inline-block' }}>
                <JoinButton variant="contained" onClick={onJoinClick} startIcon={<SportsEsportsIcon />}>
                  Join Quiz
                </JoinButton>
              </motion.div>
            </Box>
          </motion.div>
        </motion.div>
      </ContentContainer>

      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 50 }}
        style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 3 }}
      >
        <motion.img
            src={RobotMascot}
            alt="Waving Robot Mascot"
            style={{ width: 'clamp(100px, 15vw, 200px)', height: 'auto' }}
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </HomePageContainer>
  );
};

export default HomePage;