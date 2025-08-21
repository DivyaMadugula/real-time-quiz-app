// Import the Google AI SDK
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Generative AI model
// We use the API key from our .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Generates quiz questions using the Gemini API based on a given topic.
 * @param {string} topic The topic for the quiz.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of question objects.
 */
// server/services/geminiService.js

async function generateQuizQuestions(topic) {
  const prompt = `
    Generate 5 unique multiple-choice questions about the topic: "${topic}".
    The questions should be suitable for a general audience.
    Provide the response as a valid JSON array of objects.
    Each object in the array should have the following structure:
    - "questionText": The text of the question (string).
    - "options": An array of 4 strings representing the possible answers.
    - "correctAnswer": The string that is the correct answer. The correct answer must be one of the strings from the "options" array.

    Do not include any introductory text, explanations, or code block formatting in your response.
    Only output the raw JSON array.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    // --- NEW CLEANING LOGIC START ---
    // The AI might wrap the JSON in a markdown code block. We need to extract it.
    // Find the first occurrence of '[' and the last occurrence of ']'
    const startIndex = rawText.indexOf('[');
    const endIndex = rawText.lastIndexOf(']');

    if (startIndex === -1 || endIndex === -1) {
      // If we can't find a JSON array, throw an error.
      throw new Error('Valid JSON array not found in the AI response.');
    }

    // Extract the substring that contains just the JSON array.
    const jsonString = rawText.substring(startIndex, endIndex + 1);
    // --- NEW CLEANING LOGIC END ---

    // Parse the cleaned JSON string.
    const questions = JSON.parse(jsonString);
    return questions;

  } catch (error) {
    console.error('Error generating quiz questions:', error);
    return [];
  }
}
// Export the function so we can use it elsewhere in our app
module.exports = { generateQuizQuestions };