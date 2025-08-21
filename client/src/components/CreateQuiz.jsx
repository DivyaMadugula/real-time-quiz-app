import React, { useState } from 'react';
    import axios from 'axios';

    // It now receives a prop `onQuizCreated`
    const CreateQuiz = ({ onQuizCreated }) => {
      // ... (keep all your existing useState hooks: topic, loading, error)
      const [topic, setTopic] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/quizzes/generate`, { topic });
          // Call the callback function from App.jsx with the quiz data
          onQuizCreated(response.data);
        } catch (err) {
          setError('Failed to generate quiz. Please try again.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      return (
        <div>
          <h2>Create a New Quiz</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic"
              disabled={loading}
              style={{ padding: '8px', width: '300px' }}
            />
            <button type="submit" disabled={loading} style={{ padding: '8px' }}>
              {loading ? 'Generating...' : 'Generate Quiz'}
            </button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      );
    };

    export default CreateQuiz;