import React, { useState } from 'react';
    import { socket } from '../socket'; // Import the shared socket instance

    // It now receives `onQuizJoined`
    const JoinQuiz = ({ onQuizJoined }) => {
      const [username, setUsername] = useState('');
      const [quizCode, setQuizCode] = useState('');
      const [error, setError] = useState('');

      const handleJoin = (e) => {
        e.preventDefault();
        if (!username.trim() || !quizCode.trim()) {
          setError('Both username and quiz code are required.');
          return;
        }
        
        // Emit the join event with both username and quizCode
        socket.emit('join-quiz', { username, quizCode });
        
        // Call the callback from App.jsx to change the view
        onQuizJoined({ username, quizCode });
      };

      return (
        <div>
          <h2>Join a Quiz</h2>
          <form onSubmit={handleJoin}>
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                style={{ padding: '8px', margin: '5px' }}
              />
            </div>
            <div>
              <input
                type="text"
                value={quizCode}
                onChange={(e) => setQuizCode(e.target.value)}
                placeholder="Enter quiz code"
                style={{ padding: '8px', margin: '5px' }}
              />
            </div>
            <button type="submit" style={{ padding: '8px', margin: '5px' }}>
              Join Quiz
            </button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      );
    };

    export default JoinQuiz;