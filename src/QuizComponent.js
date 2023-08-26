//QuizComponent.js
import React, { useState } from 'react';

const QuizComponent = () => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);  // New state variable

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
    // Split the content at "Solutions:"
    const [rawContentBeforeSolutions, contentAfterSolutions] = data.choices[0].message.content.split('Solutions:');

    // Remove text before the first "1."
    const contentBeforeSolutions = rawContentBeforeSolutions.substring(rawContentBeforeSolutions.indexOf('1.'));
    
    const questions = contentBeforeSolutions.split('\n');
    const answers = contentAfterSolutions.split('\n');
    
    return questions.map((question, index) => {
      let formattedQuestion = question.replace(/\((\w+)\)/g, '($1) <input placeholder="$1" />');
      
      // If showAnswers is true, append the answer to the right side of the question.
      if (showAnswers && answers[index]) {
        formattedQuestion += ` Answer: ${answers[index]}`;
      }

      return (
        <p key={index} dangerouslySetInnerHTML={{ __html: formattedQuestion }} />
      );
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
      {/* quizData && (
        <pre>{JSON.stringify(quizData, null, 2)}</pre>
      )*/}
    </div>
  );
};

export default QuizComponent;
