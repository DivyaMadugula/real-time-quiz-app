const express = require('express');
const router = express.Router();
const { generateQuizQuestions } = require('../services/geminiService');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// A simple utility function to generate a random join code
function generateJoinCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// @route   POST /api/quizzes/generate
// @desc    Generate a new quiz, save it to the DB, and return it
// @access  Public
router.post('/generate', async (req, res) => {
  try {
    // 1. Get the topic from the request body
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ msg: 'Please provide a topic' });
    }

    // 2. Call our Gemini service to generate questions
    console.log(`Generating questions for topic: ${topic}...`);
    const generatedQuestions = await generateQuizQuestions(topic);

    if (!generatedQuestions || generatedQuestions.length === 0) {
      return res.status(500).json({ msg: 'Failed to generate questions. Please try again.' });
    }

    // 3. Save the generated questions to the 'questions' collection
    // The insertMany method is efficient for saving an array of documents
    const savedQuestions = await Question.insertMany(generatedQuestions);

    // Get the IDs of the newly saved questions
    const questionIds = savedQuestions.map(q => q._id);

    // 4. Create a new quiz document in the 'quizzes' collection
    const newQuiz = new Quiz({
      topic: topic,
      questions: questionIds,
      joinCode: generateJoinCode(), // Generate a unique code for joining
    });

    // 5. Save the new quiz to the database
    await newQuiz.save();

    console.log(`Successfully created quiz with code: ${newQuiz.joinCode}`);
    
    // 6. Send the created quiz back to the client
    res.status(201).json(newQuiz);

  } catch (error) {
    console.error('Error in quiz generation route:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;