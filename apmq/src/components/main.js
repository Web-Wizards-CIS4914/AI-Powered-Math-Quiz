import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "../App.css";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import {
  Container,
  Paper,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Box,
  Typography,
} from "@mui/material";

const mathJaxConfig = {
  loader: { load: ["input/asciimath"] },
  asciimath: {
    displaystyle: true,
    delimiters: [
      ["$", "$"],
      ["`", "`"],
    ],
  },
};

function Main() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [conversationContext, setConversationContext] = useState([]); // Track conversation context
  const [userMessage, setUserMessage] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedModule, setSelectedModule] = useState(null);

  const topics = [
    { name: "Real Numbers", module: "1" },
    { name: "Linear Functions", module: "2" },
    { name: "Linear Inequalities", module: "3" },
    { name: "Quadratic Functions", module: "4" },
    { name: "Polynomial Functions", module: "5" },
    { name: "Logarithms", module: "6" },
  ];

  const fetchQuestions = async (module) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/questions", {
        params: { module },
      });
      setQuestions(response.data);
      setCurrentQuestionIndex(0); // Reset to first question
      setSelectedChoice(null);
      setFeedback("");
      setChatMessages([]);
      setConversationContext([]);
      setCorrectAnswers(0);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    if (selectedModule) {
      fetchQuestions(selectedModule);
    }
  }, [selectedModule]);

  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedChoice) {
      setFeedback("Please select an answer.");
      return;
    }
  
    const isCorrect = selectedChoice.is_correct;
    const userId = localStorage.getItem("userId");
    const currentQuestion = questions[currentQuestionIndex];
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          question_id: currentQuestion.id,
          correct: isCorrect,
        }),
      });
  
      if (isCorrect) {
        setFeedback("Correct!");
        setCorrectAnswers((prev) => prev + 1);
  
        // Clear chat messages and conversation context
        setChatMessages([]);
        setConversationContext([]);
  
        setTimeout(() => {
          setFeedback("");
          setSelectedChoice(null);
          if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex((prev) => prev + 1);
          } else {
            setFeedback("You have completed all questions in this topic.");
          }
        }, 1000);
      } else {
        setFeedback("Incorrect. Try again!");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      setFeedback("Failed to update progress. Please try again.");
    }
  };

  const handleHint = async () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
      return;
    }

    const hintMessage = `What is the first step to solving the problem: "${currentQuestion.question_text}" with the expression "${currentQuestion.question_expression}"?`;

    setChatMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", text: hintMessage },
    ]);

    const updatedContext = [
      ...conversationContext,
      { role: "user", content: hintMessage },
    ];

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        messages: updatedContext,
      });

      const botResponse = response.data.response;

      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", text: botResponse },
      ]);

      setConversationContext((prevContext) => [
        ...prevContext,
        { role: "user", content: hintMessage },
        { role: "assistant", content: botResponse },
      ]);
    } catch (error) {
      console.error("Error sending hint request:", error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", text: "Error: Unable to retrieve hint." },
      ]);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    const newMessage = { role: "user", content: userMessage };
    const updatedContext = [...conversationContext, newMessage];

    setChatMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", text: userMessage },
    ]);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        messages: updatedContext,
      });

      const botResponse = response.data.response;
      const botMessage = { role: "assistant", content: botResponse };

      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", text: botResponse },
      ]);

      setConversationContext((prevContext) => [...prevContext, newMessage, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", text: "Error: Unable to retrieve response." },
      ]);
    }

    setUserMessage("");
  };

  const formatResponseText = (text) => {
    const paragraphs = text.split("\n").filter((para) => para.trim() !== "");
    return paragraphs.map((para, index) => (
      <Typography
        key={index}
        variant="body2"
        style={{ marginBottom: "8px", whiteSpace: "pre-line" }}
      >
        {para}
      </Typography>
    ));
  };

  const currentQuestion = questions[currentQuestionIndex];

  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  const wrapWithBackticks = (text) => {
    if (!text) return "";
    return `\`${text}\``;
  };

  return (
    <MathJaxContext config={mathJaxConfig}>
      <Navbar />
      <Container maxWidth="lg" style={{ paddingTop: "80px" }}>
        {questions.length > 0 && (
          <Box my={4}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" color="textSecondary">
              {`Question ${currentQuestionIndex + 1} of ${questions.length}`}
            </Typography>
          </Box>
        )}

        <Box display="flex" flexDirection="row" minHeight="75vh">
          <Box width="20%" mr={2}>
            <Paper>
              <List>
                <ListItem>
                <Typography variant="h6">MAC1105</Typography>
        </ListItem>
        {topics.map((topic, index) => (
          <ListItem
            button
            key={index}
            selected={selectedModule === topic.module}
            onClick={() => setSelectedModule(topic.module)}
            style={{
              cursor: "pointer", // Add pointer cursor
              transition: "background-color 0.3s ease", // Optional: Smooth hover transition
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")} // Optional: Hover effect
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <ListItemText primary={topic.name} />
          </ListItem>
        ))}
              </List>
            </Paper>
          </Box>

          <Box width="80%">
            {!selectedModule ? (
              <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
                <Typography variant="h6">Please select a topic to begin.</Typography>
              </Paper>
            ) : (
              <>
                {currentQuestion ? (
                  <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
                    <>
                      <Typography variant="h6">{currentQuestion.question_text}</Typography>
                      <MathJax>
                        <Typography variant="h6">
                          {wrapWithBackticks(currentQuestion.question_expression)}
                        </Typography>
                      </MathJax>

                      <FormControl component="fieldset">
                        <RadioGroup name="choices">
                          {currentQuestion.choices.map((choice) => (
                            <FormControlLabel
                              key={choice.id}
                              value={choice.id}
                              control={<Radio />}
                              label={
                                <MathJax inline>{wrapWithBackticks(choice.choice_text)}</MathJax>
                              }
                              onChange={() => handleChoiceSelect(choice)}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <Box mt={2}>
                        <Button variant="contained" color="primary" onClick={handleSubmitAnswer}>
                          Submit
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={handleHint}
                          style={{ marginLeft: "10px" }}
                        >
                          Hint
                        </Button>
                      </Box>
                      {feedback && (
                        <Typography variant="body1" color={feedback === "Correct!" ? "primary" : "error"}>
                          {feedback}
                        </Typography>
                      )}
                    </>
                  </Paper>
                ) : (
                  <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
                    <Typography variant="h6">
                      {questions.length === 0 ? "No questions available for this topic." : "Loading question..."}
                    </Typography>
                  </Paper>
                )}

                <Paper elevation={3} style={{ padding: "20px" }}>
                  <Typography variant="h6">Chatbot</Typography>
                  <Box>
                    {chatMessages.map((msg, index) => (
                      <Box key={index} mb={2}>
                        <Typography
                          variant="body2"
                          align={msg.type === "user" ? "right" : "left"}
                          style={{
                            backgroundColor: msg.type === "user" ? "#cfabff" : "#f7c39c",
                            display: "block",
                            padding: "10px 15px",
                            borderRadius: "10px",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {msg.type === "bot" ? formatResponseText(msg.text) : msg.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <form onSubmit={handleChatSubmit}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      placeholder="Type your message..."
                      multiline
                      rows={2}
                    />
                    <Box mt={1} textAlign="right">
                      <Button type="submit" variant="contained" color="primary">
                        Send
                      </Button>
                    </Box>
                  </form>
                </Paper>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </MathJaxContext>
  );
}

export default Main;
