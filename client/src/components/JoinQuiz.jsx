// import React, { useState } from 'react';
// import { socket } from '../socket';
// import { Typography, TextField, InputAdornment, CardContent, Box } from '@mui/material';
// import { StyledCard, FormContainer, ActionButton } from './JoinQuiz.styles';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import VpnKeyIcon from '@mui/icons-material/VpnKey';

// const JoinQuiz = ({ onQuizJoined }) => {
//   const [username, setUsername] = useState('');
//   const [quizCode, setQuizCode] = useState(''); // This state will control the input field
//   const [error, setError] = useState('');

//   const handleJoin = (e) => {
//     e.preventDefault();
//     if (!username.trim() || !quizCode.trim()) {
//       setError('Both fields are required.');
//       return;
//     }
//     socket.emit('join-quiz', { username, quizCode });
//     onQuizJoined({ username, quizCode });
//   };

//   return (
//     <StyledCard>
//       <CardContent>
//         <Typography variant="h5" component="h2" gutterBottom>
//           Join a Game
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           Enter your name and the quiz code to begin!
//         </Typography>
//         <FormContainer component="form" onSubmit={handleJoin} noValidate>
//           <TextField
//             margin="normal" required fullWidth
//             label="Your Username"
//             value={username} // Controlled by state
//             onChange={(e) => setUsername(e.target.value)}
//             InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircle /></InputAdornment>)}}
//           />

//           {/* --- THIS IS THE CORRECTED TEXTFIELD --- */}
//           <TextField
//             margin="normal" required fullWidth
//             label="Quiz Code"
//             value={quizCode} // Controlled by its own state, starts empty
//             onChange={(e) => setQuizCode(e.target.value.toUpperCase())} // Update state and convert to uppercase
//             InputProps={{ startAdornment: (<InputAdornment position="start"><VpnKeyIcon /></InputAdornment>)}}
//           />

//           {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
//           <ActionButton type="submit" fullWidth variant="contained" color="primary">
//             Let's Go!
//           </ActionButton>
//         </FormContainer>
//       </CardContent>
//     </StyledCard>
//   );
// };

// export default JoinQuiz;
import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import { Typography, TextField, InputAdornment, CardContent, Box } from '@mui/material';
import { StyledCard, FormContainer, ActionButton } from './JoinQuiz.styles';
import AccountCircle from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const JoinQuiz = ({ onQuizJoined }) => {
  const [username, setUsername] = useState('');
  const [quizCode, setQuizCode] = useState('');
  const [error, setError] = useState('');

  // --- NEW: Listen for server-side validation ---
  useEffect(() => {
    const onQuizNotFound = (errorMessage) => {
      setError(errorMessage);
    };
    
    socket.on('quiz-not-found', onQuizNotFound);

    return () => {
      socket.off('quiz-not-found', onQuizNotFound);
    };
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    if (!username.trim() || !quizCode.trim()) {
      setError('Both fields are required.');
      return;
    }
    socket.emit('join-quiz', { username, quizCode });
    onQuizJoined({ username, quizCode });
  };

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>Join a Game</Typography>
        <Typography variant="body2" color="text.secondary">Enter your name and the quiz code to begin!</Typography>
        <FormContainer component="form" onSubmit={handleJoin} noValidate>
          <TextField
            margin="normal" required fullWidth
            label="Your Username" value={username} onChange={(e) => setUsername(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircle /></InputAdornment>) }}
          />
          <TextField
            margin="normal" required fullWidth
            label="Quiz Code" value={quizCode} onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
            error={!!error} helperText={error} // Display error message here
            InputProps={{ startAdornment: (<InputAdornment position="start"><VpnKeyIcon /></InputAdornment>) }}
          />
          <ActionButton type="submit" fullWidth variant="contained" color="primary">Let's Go!</ActionButton>
        </FormContainer>
      </CardContent>
    </StyledCard>
  );
};

export default JoinQuiz;