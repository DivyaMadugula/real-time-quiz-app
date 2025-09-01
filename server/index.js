// const express = require('express');
// const http = require('http');
// const { Server } = require("socket.io");
// const cors = require('cors');
// const connectDB = require('./config/db');
// require('dotenv').config();

// const Quiz = require('./models/Quiz');
// const Question = require('./models/Question');
// const quizRoutes = require('./routes/quizRoutes');

// connectDB();
// const app = express();
// app.use(cors());
// app.use(express.json());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//      origin: process.env.CLIENT_URL || "http://localhost:5173",
//     methods: ["GET", "POST"]
//   }
// });

// app.get('/', (req, res) => res.send('API is running...'));
// app.use('/api/quizzes', quizRoutes);

// const quizRooms = {};

// function checkRoundCompletion(quizCode) {
//     const room = quizRooms[quizCode];
//     if (room && room.quizData && room.players.length > 0 && room.answersReceived >= room.players.length) {
//         const currentQuestion = room.quizData.questions[room.currentQuestionIndex];
        
//         setTimeout(() => {
//             if (quizRooms[quizCode]) {
//                 // Step 1: Reveal the correct answer to EVERYONE.
//                 io.in(quizCode).emit('reveal-answer', { correctAnswer: currentQuestion.correctAnswer });
                
//                 // Step 2: After a delay, move EVERYONE to the leaderboard screen.
//                 setTimeout(() => {
//                     if (quizRooms[quizCode]) {
//                         io.in(quizCode).emit('show-leaderboard');
//                     }
//                 }, 3000);
//             }
//         }, 500);
//     }
// }

// function advanceToNextQuestion(quizCode) {
//     const room = quizRooms[quizCode];
//     if (!room) return;
  
//     if (room.players) {
//         room.players.forEach(p => p.hasAnswered = false);
//     }
  
//     room.answersReceived = 0;
//     room.currentQuestionIndex++;
  
//     if (room.currentQuestionIndex < room.quizData.questions.length) {
//       const currentQuestion = room.quizData.questions[room.currentQuestionIndex];
      
//       const questionData = {
//         _id: currentQuestion._id,
//         questionText: currentQuestion.questionText,
//       };
//       io.in(quizCode).emit('show-question', questionData);
      
//       setTimeout(() => {
//         if (quizRooms[quizCode]) { 
//           const answerData = {
//             options: currentQuestion.options,
//           };
//           io.in(quizCode).emit('show-answers', answerData);
//         }
//       }, 4000);

//     } else {
//       io.in(quizCode).emit('quiz-over', room.players);
//       setTimeout(() => delete quizRooms[quizCode], 60000);
//     }
// }

// io.on('connection', (socket) => {
//     socket.on('join-quiz', ({ username, quizCode }) => {
//         if (!username || !quizCode) return;
//         socket.join(quizCode);
//         if (!quizRooms[quizCode]) {
//             quizRooms[quizCode] = { players: [] };
//         }
//         quizRooms[quizCode].players.push({ id: socket.id, username, score: 0, hasAnswered: false, streak: 0 });
//         io.in(quizCode).emit('update-player-list', quizRooms[quizCode].players);
//     });

//     socket.on('get-player-list', (quizCode) => {
//         const room = quizRooms[quizCode];
//         if (room && room.players) {
//             socket.emit('update-player-list', room.players);
//         }
//     });

//     socket.on('start-quiz', async (quizCode) => {
//         try {
//             const quiz = await Quiz.findOne({ joinCode: quizCode }).populate('questions');
//             if (quiz && quiz.questions.length > 0) {
//                 const room = quizRooms[quizCode];
//                 if (!room) return;
//                 room.quizData = quiz;
//                 room.currentQuestionIndex = -1;
//                 room.answersReceived = 0;
//                 io.in(quizCode).emit('quiz-started');
//                 setTimeout(() => advanceToNextQuestion(quizCode), 1000);
//             } else {
//                 socket.emit('error-starting-quiz', 'Quiz could not be found.');
//             }
//         } catch (error) {
//             console.error('Error starting quiz:', error);
//         }
//     });

//     socket.on('submit-answer', ({ quizCode, answer }) => {
//         try {
//             const room = quizRooms[quizCode];
//             if (!room || !room.quizData) return;
//             const playerIndex = room.players.findIndex(p => p.id === socket.id);
//             if (playerIndex === -1 || room.players[playerIndex].hasAnswered) return;

//             room.players[playerIndex].hasAnswered = true;
//             room.answersReceived++;
//             const currentQuestion = room.quizData.questions[room.currentQuestionIndex];
//             const isCorrect = currentQuestion.correctAnswer === answer;

//             if (isCorrect) {
//                 room.players[playerIndex].score = (room.players[playerIndex].score || 0) + 10;
//                 room.players[playerIndex].streak = (room.players[playerIndex].streak || 0) + 1;
//             } else {
//                 room.players[playerIndex].streak = 0;
//             }

//             socket.emit('answer-result', { isCorrect });
//             io.in(quizCode).emit('update-player-list', room.players);
//             checkRoundCompletion(quizCode);
//         } catch (error) {
//             console.error('Error handling answer submission:', error);
//         }
//     });

//     socket.on('next-question-request', (quizCode) => {
//         advanceToNextQuestion(quizCode);
//     });
  
//     socket.on('disconnect', () => {
//         for (const quizCode in quizRooms) {
//             const room = quizRooms[quizCode];
//             const playerIndex = room.players.findIndex(p => p.id === socket.id);
//             if (playerIndex !== -1) {
//                 room.players.splice(playerIndex, 1);
//                 io.in(quizCode).emit('update-player-list', room.players);
//                 if (room.players.length === 0) {
//                     delete quizRooms[quizCode];
//                 } else {
//                     checkRoundCompletion(quizCode);
//                 }
//                 break;
//             }
//         }
//     });
// });

// const PORT = process.env.PORT || 5001;
// server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
const mongoose = require('mongoose'); 
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const Quiz = require('./models/Quiz');
const Question = require('./models/Question');
const quizRoutes = require('./routes/quizRoutes');

// Initialize express
const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  // mongoose.connection.readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'Connected' : 'Disconnected';

  if (dbState === 1) {
    res.status(200).json({ 
      status: 'ok', 
      database: dbStatus,
      timestamp: new Date().toISOString() 
    });
  } else {
    res.status(503).json({ 
      status: 'error', 
      database: dbStatus,
      timestamp: new Date().toISOString() 
    });
  }
});

// Routes
app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/quizzes', quizRoutes);

// Setup server + socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// In-memory quiz rooms
const quizRooms = {};

function checkRoundCompletion(quizCode) {
  const room = quizRooms[quizCode];
  if (room && room.quizData && room.players.length > 0 && room.answersReceived >= room.players.length) {
    const currentQuestion = room.quizData.questions[room.currentQuestionIndex];
    
    setTimeout(() => {
      if (quizRooms[quizCode]) {
        // Step 1: Reveal the correct answer to EVERYONE.
        io.in(quizCode).emit('reveal-answer', { correctAnswer: currentQuestion.correctAnswer });
        
        // Step 2: After a delay, move EVERYONE to the leaderboard screen.
        setTimeout(() => {
          if (quizRooms[quizCode]) {
            io.in(quizCode).emit('show-leaderboard');
          }
        }, 3000);
      }
    }, 500);
  }
}

function advanceToNextQuestion(quizCode) {
  const room = quizRooms[quizCode];
  if (!room) return;

  if (room.players) {
    room.players.forEach(p => p.hasAnswered = false);
  }

  room.answersReceived = 0;
  room.currentQuestionIndex++;

  if (room.currentQuestionIndex < room.quizData.questions.length) {
    const currentQuestion = room.quizData.questions[room.currentQuestionIndex];
    
    const questionData = {
      _id: currentQuestion._id,
      questionText: currentQuestion.questionText,
    };
    io.in(quizCode).emit('show-question', questionData);
    
    setTimeout(() => {
      if (quizRooms[quizCode]) { 
        const answerData = {
          options: currentQuestion.options,
        };
        io.in(quizCode).emit('show-answers', answerData);
      }
    }, 4000);

  } else {
    io.in(quizCode).emit('quiz-over', room.players);
    setTimeout(() => delete quizRooms[quizCode], 60000);
  }
}

io.on('connection', (socket) => {
  socket.on('join-quiz', ({ username, quizCode }) => {
    if (!username || !quizCode) return;
    socket.join(quizCode);
    if (!quizRooms[quizCode]) {
      quizRooms[quizCode] = { players: [] };
    }
    quizRooms[quizCode].players.push({ id: socket.id, username, score: 0, hasAnswered: false, streak: 0 });
    io.in(quizCode).emit('update-player-list', quizRooms[quizCode].players);
  });

  socket.on('get-player-list', (quizCode) => {
    const room = quizRooms[quizCode];
    if (room && room.players) {
      socket.emit('update-player-list', room.players);
    }
  });

  socket.on('start-quiz', async (quizCode) => {
    try {
      const quiz = await Quiz.findOne({ joinCode: quizCode }).populate('questions');
      if (quiz && quiz.questions.length > 0) {
        const room = quizRooms[quizCode];
        if (!room) return;
        room.quizData = quiz;
        room.currentQuestionIndex = -1;
        room.answersReceived = 0;
        io.in(quizCode).emit('quiz-started');
        setTimeout(() => advanceToNextQuestion(quizCode), 1000);
      } else {
        socket.emit('error-starting-quiz', 'Quiz could not be found.');
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
    }
  });

  socket.on('submit-answer', ({ quizCode, answer }) => {
    try {
      const room = quizRooms[quizCode];
      if (!room || !room.quizData) return;
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex === -1 || room.players[playerIndex].hasAnswered) return;

      room.players[playerIndex].hasAnswered = true;
      room.answersReceived++;
      const currentQuestion = room.quizData.questions[room.currentQuestionIndex];
      const isCorrect = currentQuestion.correctAnswer === answer;

      if (isCorrect) {
        room.players[playerIndex].score = (room.players[playerIndex].score || 0) + 10;
        room.players[playerIndex].streak = (room.players[playerIndex].streak || 0) + 1;
      } else {
        room.players[playerIndex].streak = 0;
      }

      socket.emit('answer-result', { isCorrect });
      io.in(quizCode).emit('update-player-list', room.players);
      checkRoundCompletion(quizCode);
    } catch (error) {
      console.error('Error handling answer submission:', error);
    }
  });

  socket.on('next-question-request', (quizCode) => {
    advanceToNextQuestion(quizCode);
  });

  socket.on('disconnect', () => {
    for (const quizCode in quizRooms) {
      const room = quizRooms[quizCode];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        io.in(quizCode).emit('update-player-list', room.players);
        if (room.players.length === 0) {
          delete quizRooms[quizCode];
        } else {
          checkRoundCompletion(quizCode);
        }
        break;
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
