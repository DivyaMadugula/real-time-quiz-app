import React, { useState } from 'react';
import axios from 'axios';

// --- THIS IS THE CORRECTED LINE ---
// Import Box along with the other MUI components
import { TextField, CircularProgress, InputAdornment, Box } from '@mui/material';
import { FormContainer, Title, Subtitle, ActionButton, LoadingWrapper } from './CreateQuiz.styles';
import LightbulbIcon from '@mui/icons-material/Lightbulb'; // A great icon for "topic"

const CreateQuiz = ({ onQuizCreated }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/quizzes/generate`, { topic });
      onQuizCreated(response.data);
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
      console.error('Quiz generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box textAlign="center">
      <Title variant="h4" component="h2">
        Create a New Quiz
      </Title>
      <Subtitle variant="body1" color="text.secondary">
        Enter any topic, and our AI will do the rest!
      </Subtitle>
      <FormContainer component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal" required fullWidth
          id="topic" label="Quiz Topic" name="topic"
          autoFocus value={topic} onChange={(e) => setTopic(e.target.value)}
          error={!!error} helperText={error}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LightbulbIcon color="secondary" />
              </InputAdornment>
            ),
          }}
        />
        <LoadingWrapper>
          <ActionButton type="submit" fullWidth variant="contained" disabled={loading}>
            Generate Quiz
          </ActionButton>
          {loading && (
            <CircularProgress size={24} color="secondary" sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }}/>
          )}
        </LoadingWrapper>
      </FormContainer>
    </Box>
  );
};

export default CreateQuiz;