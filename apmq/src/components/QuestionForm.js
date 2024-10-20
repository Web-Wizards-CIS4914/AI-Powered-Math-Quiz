// This component will handle the user input, allowing the student to type in algebra questions.
import React, { useState } from 'react';
import '../App.css';

function QuestionForm({ onSubmit }) {
    const [question, setQuestion] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(question);
      setQuestion('');  // Clear the input after submitting
    };

    return (
      <form onSubmit={handleSubmit}>
        <textarea
          type="text"
          placeholder="Enter your question here"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      
    );
}

export default QuestionForm;
