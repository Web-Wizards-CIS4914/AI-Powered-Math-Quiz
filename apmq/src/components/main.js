import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import '../App.css';
import { MathJax, MathJaxContext } from "better-react-mathjax";


const mathJaxConfig = {
  loader: { load: ["input/asciimath"] },
  asciimath: {
    displaystyle: true,
    delimiters: [["$", "$"], ["`", "`"]]
  }
};

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
        console.log("Fetched questions:", response.data);
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
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
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

    setUserMessage('');
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Wraps text with backticks for AsciiMath rendering
  const wrapWithBackticks = (text) => {
    if (!text) return "";
    return `\`${text}\``;
  };

  return (
    <MathJaxContext config={mathJaxConfig}>
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
                {/* Display question text */}
                <p>{currentQuestion.question_text}</p>

                {/* Display question expression below the text */}
                <MathJax>
                  <p>{wrapWithBackticks(currentQuestion.question_expression)}</p>
                </MathJax>

                {/* Render choices */}
                <form onSubmit={(e) => e.preventDefault()}>
                  {currentQuestion.choices.map((choice) => (
                    <label key={choice.id} style={{ display: 'block', marginBottom: '10px' }}>
                      <input
                        type="radio"
                        name="choice"
                        value={choice.id}
                        onChange={() => handleChoiceSelect(choice)}
                      />
                      <MathJax inline>{wrapWithBackticks(choice.choice_text)}</MathJax>
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
    </MathJaxContext>
  );
}

export default Main;
