import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import '../App.css';
import { MathComponent } from 'mathjax-react';

function Main() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/questions');
        setQuestions(response.data);
        console.log("Fetched questions:", response.data);  // Debug: Log fetched data
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice);
  };

  const handleSubmitAnswer = () => {
    if (selectedChoice) {
      if (selectedChoice.is_correct) {
        setFeedback("Correct!");
        setTimeout(() => {
          setFeedback("");
          setSelectedChoice(null);
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Move to the next question
        }, 1000);
      } else {
        setFeedback("Incorrect. Try again!");
      }
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    setChatMessages([...chatMessages, { type: 'user', text: userMessage }]);

    try {
      const response = await axios.post('http://127.0.0.1:8000/chat', { message: userMessage });
      const botResponse = response.data.response;
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: botResponse },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: 'Error: Unable to retrieve response.' },
      ]);
    }

    setUserMessage(''); // Clear the input field
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Function to remove dollar signs and convert double backslashes to single backslashes
  const formatLatex = (text) => {
    if (text) {
      return text.replace(/\$/g, '').replace(/\\\\/g, '\\'); // Remove $ symbols and fix backslashes
    }
    return text;
  };

  return (
    <>
      <Navbar />
      <div className="container">
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

        <div className="main-content">
          <div className="question-box">
            {currentQuestion ? (
              <>
                {/* Display raw question text without dollar signs */}
                <p>{formatLatex(currentQuestion.question_text)}</p>

                {/* Choices */}
                <form onSubmit={(e) => e.preventDefault()}>
                  {currentQuestion.choices.map((choice) => (
                    <label key={choice.id} style={{ display: 'block', marginBottom: '10px' }}>
                      <input
                        type="radio"
                        name="choice"
                        value={choice.id}
                        onChange={() => handleChoiceSelect(choice)}
                      />
                      {/* Render each choice with MathComponent */}
                      <MathComponent tex={String.raw`${formatLatex(choice.choice_text)}`} display={false} />
                    </label>
                  ))}
                  <button onClick={handleSubmitAnswer}>Submit</button>
                </form>
                {feedback && <p>{feedback}</p>}
              </>
            ) : (
              <p>Loading question...</p>
            )}
          </div>

          {/* Chatbox */}
          <div className="chatbot">
            <div className="chatbox">
              {chatMessages.map((msg, index) => (
                <p key={index} className={msg.type === 'user' ? 'user-message' : 'bot-message'}>
                  {msg.text}
                </p>
              ))}
            </div>
            <form onSubmit={handleChatSubmit}>
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
