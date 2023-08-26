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
      const fullContent = data.choices[0].message.content;
      const [questionsPart, answersPart] = fullContent.split('Verb solutions in order of question:');
      
      // Extract answers into an array
      const answersArray = answersPart.trim().split('\n').map(answer => answer.split('.')[1].trim());

      const sentences = questionsPart.split('\n');
      return (
        <>
          {sentences.map((sentence, index) => {
            if (index < 5) {
              const formattedSentence = sentence.replace(/\((\w+)\)/g, '($1) <input placeholder="$1" />');
              return (
                <p key={index} dangerouslySetInnerHTML={{ __html: formattedSentence }} />
              );
            }
            return null;
          })}
          {showAnswers && (
            <div>
              <p>Test: {answersArray.join(', ')}</p>
            </div>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <div>
      <button onClick={generateNewQuiz}>Generate New Quiz</button>
      <button onClick={() => setShowAnswers(!showAnswers)}>Show Answers</button>
      
      {loading && <p>Loading...</p>}

      {formatQuestions(quizData)}
    </div>
  );
};

export default QuizComponent;