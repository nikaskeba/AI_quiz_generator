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

   const formatQuestions = (data) => {
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      const sentences = data.choices[0].message.content.split('\n');
      return sentences.map((sentence, index) => {
        // Render only the first five sentences unconditionally
        if (index < 5) {
          return <p key={index}>{sentence}</p>;
        }
        // Render sentences after the fifth one based on showAnswers state
        return showAnswers ? <p key={index}>{sentence}</p> : null;
      });
    }
    return null;
  };
  return (
    <div>
      <button onClick={generateNewQuiz}>Generate New Quiz</button>
            <button onClick={() => setShowAnswers(!showAnswers)}>Show Answers</button> {/* New button */}

            {formatQuestions(quizData)}

      {loading && <p>Loading...</p>}

      {/* Display API Response for Debugging */}
      {quizData && (
        <pre>{JSON.stringify(quizData, null, 2)}</pre>
      )}
    </div>
  );
};

export default QuizComponent;
