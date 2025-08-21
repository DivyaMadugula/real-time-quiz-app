const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Import Mongoose Models - These are needed for the 'start-quiz' event
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');

// Import API routes
const quizRoutes = require('./routes/quizRoutes');

// --- Basic Setup ---
connectDB();
const app = express();
app.use(cors());
app.use(express.json());

// --- Create HTTP Server and Attach Socket.io ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
     origin: process.env.CLIENT_URL || "http://localhost:5173", // Your React app's address
    methods: ["GET", "POST"]
  }
});

// --- API Routes (handled by Express) ---
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/quizzes', quizRoutes);


// --- Real-Time Connection Logic (handled by Socket.io) ---

// This object will store the state of all active quiz rooms
const quizRooms = {};

io.on('connection', (socket) => {
  console.log(`---> User Connected: ${socket.id}`);

  // Event handler for when a user joins a quiz room
  socket.on('join-quiz', ({ username, quizCode }) => {
    if (!username || !quizCode) {
        console.log(`---> Invalid join-quiz data from ${socket.id}`);
        return;
    }
    
    console.log(`---> User ${username} (${socket.id}) is joining room: ${quizCode}`);
    socket.join(quizCode);

    if (!quizRooms[quizCode]) {
      quizRooms[quizCode] = { players: [] };
    }
    
    quizRooms[quizCode].players.push({ id: socket.id, username: username });

    io.in(quizCode).emit('update-player-list', quizRooms[quizCode].players);
  });

  // Event handler for when the host starts the quiz
  socket.on('start-quiz', async (quizCode) => {
    console.log(`---> Quiz start initiated for room: ${quizCode}`);

    try {
      // Find the quiz in the database and populate its questions
      const quiz = await Quiz.findOne({ joinCode: quizCode }).populate('questions');
      
      if (quiz && quiz.questions.length > 0) {
        // Store the full quiz data in our room state for later access
        quizRooms[quizCode].quizData = quiz;
        quizRooms[quizCode].currentQuestionIndex = 0;

        const firstQuestion = quiz.questions[0];

        // Emit the 'quiz-started' event to everyone in the room
        io.in(quizCode).emit('quiz-started');
        
        // A short delay before sending the first question
        setTimeout(() => {
          io.in(quizCode).emit('next-question', firstQuestion);
          console.log(`---> Sent first question for quiz ${quizCode}`);
        }, 1000); // 1-second delay

      } else {
        console.log(`---> Quiz with code ${quizCode} not found or has no questions.`);
        socket.emit('error-starting-quiz', 'Quiz could not be found.');
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
    }
  });

  // Inside io.on('connection', ...)

  // ... after the 'start-quiz' handler

  // Event handler for a player submitting an answer
  socket.on('submit-answer', ({ quizCode, answer }) => {
    try {
      const room = quizRooms[quizCode];
      // Find the player in our room state who submitted the answer
      const player = room.players.find(p => p.id === socket.id);
      
      if (!room || !player) return;

      // Get the current question to check the correct answer
      const currentQuestion = room.quizData.questions[room.currentQuestionIndex];
      const isCorrect = currentQuestion.correctAnswer === answer;

      if (isCorrect) {
        // Award points. Initialize score if it doesn't exist.
        player.score = (player.score || 0) + 10; 
      }

      // Send feedback to the player who answered
      socket.emit('answer-result', { isCorrect });

      // Broadcast the updated scores to everyone in the room
      io.in(quizCode).emit('update-player-list', room.players);

    } catch (error) {
      console.error('Error handling answer submission:', error);
    }
  });

  // Inside io.on('connection', ...)

  // ... after the 'submit-answer' handler

  // Event handler for the host requesting the next question
  socket.on('next-question-request', (quizCode) => {
    try {
      const room = quizRooms[quizCode];
      if (!room) return;

      // Move to the next question
      room.currentQuestionIndex++;

      // Check if the quiz is over
      if (room.currentQuestionIndex < room.quizData.questions.length) {
        const nextQuestion = room.quizData.questions[room.currentQuestionIndex];
        io.in(quizCode).emit('next-question', nextQuestion);
      } else {
        // The quiz is over
        io.in(quizCode).emit('quiz-over', room.players); // Send final scores
        console.log(`---> Quiz ${quizCode} is over.`);
        // Clean up the room after a delay
        setTimeout(() => delete quizRooms[quizCode], 60000); // 1 minute cleanup
      }
    } catch (error) {
      console.error('Error advancing to next question:', error);
    }
  });

  
  
  // Event handler for when a user disconnects
  socket.on('disconnect', () => {
    console.log(`---> User Disconnected: ${socket.id}`);

    for (const quizCode in quizRooms) {
      const room = quizRooms[quizCode];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);

      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        io.in(quizCode).emit('update-player-list', room.players);
        console.log(`---> User ${socket.id} was removed from room ${quizCode}`);
        
        if (room.players.length === 0) {
            delete quizRooms[quizCode];
            console.log(`---> Room ${quizCode} is now empty and has been closed.`);
        }
        break;
      }
    }
  });
});


// --- Start the Server ---
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} and listening for real-time connections.`);
});