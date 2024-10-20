import React, { useState } from 'react';

function QuestionSelect({ onSubmit }) {
    const [selectedAnswer, setSelectedAnswer] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(selectedAnswer);
      setSelectedAnswer('');  // Clear the selected answer after submitting
    };

    return (
      <form id="quiz-form" onSubmit={handleSubmit}>
        <p>Express 5<sup>3</sup> = 125 in logarithm form</p>
        
        <label>
          <input 
            type="radio" 
            name="answer" 
            value="A" 
            checked={selectedAnswer === 'A'}
            onChange={(e) => setSelectedAnswer(e.target.value)} 
          />
          Log<sub>5</sub>125 = 3
        </label><br />
        
        <label>
          <input 
            type="radio" 
            name="answer" 
            value="B" 
            checked={selectedAnswer === 'B'}
            onChange={(e) => setSelectedAnswer(e.target.value)} 
          />
          Log<sub>5</sub>125 = 5
        </label><br />
        
        <label>
          <input 
            type="radio" 
            name="answer" 
            value="C" 
            checked={selectedAnswer === 'C'}
            onChange={(e) => setSelectedAnswer(e.target.value)} 
          />
          Log<sub>125</sub>5 = 3
        </label><br />
        
        <button type="submit">Submit</button>
      </form>
    );
}

export default QuestionSelect;
