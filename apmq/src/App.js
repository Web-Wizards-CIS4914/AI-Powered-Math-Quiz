import React, { useState } from 'react';
import QuestionForm from './components/QuestionForm';
import ResponseDisplay from './components/ResponseDisplay';
import QuestionSelect from './components/QuestionSelect';
import axios from 'axios';
import './App.css';

function App() {
  const [response, setResponse] = useState('');

  const handleSubmit = async (question) => {
    // Send the question to the backend (FastAPI) and get the response
    try {
      const result = await axios.post('http://backend-url/solve', { question });
      setResponse(result.data.answer);
    } catch (error) {
      console.error('Error fetching the solution', error);
      setResponse('Sorry, there was an error.');
    }
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li><a href="#">Real Numbers</a></li>
          <li><a href="#">Linear Functions</a></li>
          <li><a href="#">Linear Inequalities</a></li>
          <li><a href="#">Quadratic Functions</a></li>
          <li><a href="#">Polynomial Functions</a></li>
          <li><a href="#">Logarithms</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Question Box */}
        <div className="question-box">
          <h2>Q. 13</h2>
          <QuestionSelect onSubmit={handleSubmit} />
          <div className="hint">
            <p>Hint: a^b = c ={'>'} log<sub>a</sub>c = b</p>
          </div>
        </div>

        {/* Chatbot */}
        <div className="chatbot">
          <div className="chatbox">
            <p className="bot-message">Hello, let me know how I can assist you with this question.</p>
            <p className="user-message">How do logarithms work?</p>
            <p className="bot-message">Logs are how you find an unknown exponent. Take the equation a^x = b...</p>
            <p className="user-message">Can you explain it again?</p>
            <p className="bot-message">Logs are the inverse of exponentiation...</p>
          </div>
          <QuestionForm onSubmit={handleSubmit} />
        </div>

        {/* Display the response from GPT */}
        <ResponseDisplay response={response} />
      </div>
    </div>
  );
}

export default App;
