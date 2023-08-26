//QuizComponent.js
import React, { useState } from 'react';

const QuizComponent = () => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);  // New state variable
  const [inputValues, setInputValues] = useState({});  // Store user inputs


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



  const handleInputChange = (index, value) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [index]: value
    }));
  };

  const checkAnswers = () => {
    const answers = formatAnswers(quizData);
    for (let i = 0; i < answers.length; i++) {
      const inputBox = document.getElementById(`input-${i}`);
      if (inputBox) {
        inputBox.style.backgroundColor = inputValues[i] === answers[i] ? 'green' : 'red';
      }
    }
  };

  const formatAnswers = (data) => {
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      const [, rawContentAfterSolutions] = data.choices[0].message.content.split('Solutions:');
      const contentAfterSolutions = rawContentAfterSolutions.substring(rawContentAfterSolutions.indexOf('1.'));
      return contentAfterSolutions.split('\n').map(answer => answer.replace(/^\d+\.\s*/, ''));
    }
    return [];
  };



const formatQuestions = (data) => {
  if (data && data.choices && data.choices[0] && data.choices[0].message) {
    // Split the content at "Solutions:"
    const [rawContentBeforeSolutions, rawContentAfterSolutions] = data.choices[0].message.content.split('Solutions:');

    // Extract questions and remove text before the first "1."
    const contentBeforeSolutions = rawContentBeforeSolutions.substring(rawContentBeforeSolutions.indexOf('1.'));
    const questions = contentBeforeSolutions.split('\n');

    // Start answers from the first occurrence of "1."
    const contentAfterSolutions = rawContentAfterSolutions.substring(rawContentAfterSolutions.indexOf('1.'));
    const answers = contentAfterSolutions.split('\n');
    
     return questions.map((question, index) => {
      let formattedQuestion = question.replace(/\((\w+)\)/g, (match, p1) => {
        return `(${p1}) <input id="input-${index}" placeholder="${p1}" onChange={(e) => handleInputChange(index, e.target.value)} />`;
      });
     // If showAnswers is true, append the answer to the right side of the question.
      if (showAnswers && answers[index]) {
        // Remove leading number and dot, e.g., "1. answer" becomes "answer"
        let formattedAnswer = answers[index].replace(/^\d+\.\s*/, '');
        formattedQuestion += `${formattedAnswer}`;
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
      <button onClick={() => setShowAnswers(!showAnswers)}>Show Answers</button>
      <button onClick={checkAnswers}>Check</button> {/* New Check button */}
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
