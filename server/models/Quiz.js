const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: [true, 'Please provide a topic'],
    trim: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question' // This creates a relationship to the Question model
  }],
  // We can add more fields later, like a unique join code for the quiz
  joinCode: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', quizSchema);