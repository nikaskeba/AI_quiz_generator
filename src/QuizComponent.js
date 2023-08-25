//QuizComponent.js
import React, { useState } from 'react';

const QuizComponent = () => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);

const generateNewQuiz = async () => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/getQuizQuestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setQuizData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      setLoading(false);
    }
};


  return (
    <div>
      <button onClick={generateNewQuiz}>Generate New Quiz</button>
      
      {loading && <p>Loading...</p>}

      {/* Display API Response for Debugging */}
      {quizData && (
        <pre>{JSON.stringify(quizData, null, 2)}</pre>
      )}
    </div>
  );
};

export default QuizComponent;
