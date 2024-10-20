// This component will display the response from the GPT-2/3 model after the user submits a question.
import React from 'react';

function ResponseDisplay({ response }) {
    return (
      <div>
        <h2>Solution:</h2>
        <p>{response}</p>
      </div>
    );
  }

  export default ResponseDisplay;
