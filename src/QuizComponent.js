//QuizComponent.js
import React, { useState } from 'react';
import './QuizComponent.css';
const QuizComponent = () => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);  // New state variable
  const [feedback, setFeedback] = useState({}); // New state to store feedback for each question
  const [quizType, setQuizType] = useState('Subjunctive'); // New state for quiz type

const generateNewQuiz = async () => {
  setLoading(true);

  // Reset the feedback state
  setFeedback({});

  // Clear input boxes
  for (let i = 0; i < 5; i++) { // Assuming you know there are always 5 questions; adjust if variable
    const inputElement = document.getElementById(`input-${i}`);
    if (inputElement) {
      inputElement.value = '';
    }
  }

 // Determine the content based on the selected quiz type
    let userContent;
      if (quizType === 'Imperative') {
    userContent = "generate 5 complete spanish imperative sentences with the sentence verb unconjugated inside a () and the conjugated answer at the end in () for example '1.(venir) a la fiesta. (venga)'  output only sentences 1 to 5";
} else if (quizType === 'Subjunctive') {
    userContent = "generate 5 complete spanish imperative sentences with the sentence verb unconjugated inside a () and the conjugated answer at the end in () for example '1. Es probable que Juan (venir) a la fiesta. (venga)'  output only sentences 1 to 5";
} else if (quizType === 'Basic Conjugation') {
    userContent = "generate 5 basic spanish present tense sentences with the sentence verb unconjugated inside a () and the conjugated answer at the end in () for example '1. Juan (venir) a la fiesta. (viene)'  output only sentences 1 to 5";
}

    try {
      const response = await fetch('/.netlify/functions/getQuizQuestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: userContent }) // Sending content to the serverless function
      });

      const data = await response.json();
      setQuizData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      setLoading(false);
    }
  };



const checkAnswers = () => {
  let newFeedback = {};

  if (!quizData || !quizData.choices || !quizData.choices[0] || !quizData.choices[0].message) {
    console.error("Invalid quiz data");
    return;
  }

  // Split based on the second occurrence of "1."
  let firstIndex = quizData.choices[0].message.content.indexOf('1.');
  let secondIndex = quizData.choices[0].message.content.indexOf('1.', firstIndex + 1);

  if (secondIndex === -1) {
    console.error('Unexpected data format');
    return;
  }

  const contentAfterSolutions = quizData.choices[0].message.content.substring(secondIndex);
  const answers = contentAfterSolutions.split('\n');

  answers.forEach((answer, index) => {
    let formattedAnswer = answer.replace(/^\d+\.\s*/, '');
    let inputElement = document.getElementById(`input-${index}`);
    let userInput = inputElement ? inputElement.value : null;

    if (userInput === formattedAnswer) {
      newFeedback[index] = "correct";
    } else {
      newFeedback[index] = "wrong";
    }
  });

  setFeedback(newFeedback);
};



const formatQuestions = (data) => {
  let renderedQuestions = [];

  if (data && data.choices && data.choices[0] && data.choices[0].message) {
    // Finding the second occurrence of "1."
    let firstIndex = data.choices[0].message.content.indexOf('1.');
    let secondIndex = data.choices[0].message.content.indexOf('1.', firstIndex + 1);
    
    if (secondIndex === -1) {
      console.error('Unexpected data format');
      return;
    }

    const contentBeforeSolutions = data.choices[0].message.content.substring(firstIndex, secondIndex).trim();
    const questions = contentBeforeSolutions.split('\n');

    const contentAfterSolutions = data.choices[0].message.content.substring(secondIndex);
    const answers = contentAfterSolutions.split('\n');

    questions.forEach((question, index) => {
      // Split the question around the placeholder
      let parts = question.split(/\((\w+)\)/g);

      // If parts length is less than 3, it's not a valid question, so skip
      if (parts.length < 3) return;

      let feedbackElement = null;
      if (feedback[index]) {
        feedbackElement = <span className={`feedback ${feedback[index]}`}>{feedback[index]}</span>;
      }

      let answerText = null;
      if (showAnswers && answers[index]) {
                let formattedAnswer = answers[index].match(/\(\w+\)\s*\((\w+)\)/)[1];
        answerText = <span>{formattedAnswer}</span>;
      }

      renderedQuestions.push(
        <p key={index}>
          {parts[0]} 
          <input id={`input-${index}`} placeholder={parts[1]} /> 
          {parts[2]} {answerText} {feedbackElement}
        </p>
      );
    });
  }

  return renderedQuestions;
};




  const selectQuizType = (type) => {
    setQuizType(type);
  };

return (
    <div>
      {/* Selector buttons for quiz type */}
      <div className="quiz-selector">
        <button 
            className={quizType === 'Subjunctive' ? 'selected-quiz' : ''} 
            onClick={() => selectQuizType('Subjunctive')}
        >
            Subjunctive
        </button>
        <button 
            className={quizType === 'Basic Conjugation' ? 'selected-quiz' : ''} 
            onClick={() => selectQuizType('Basic Conjugation')}
        >
            Basic Conjugation
        </button>
        {/* New button for Imperative */}
        <button 
            className={quizType === 'Imperative' ? 'selected-quiz' : ''} 
            onClick={() => selectQuizType('Imperative')}
        >
            Imperative
        </button>
      </div>

      <button onClick={generateNewQuiz}>Generate New Quiz</button>
      <button onClick={checkAnswers}>Check</button>
      <button onClick={() => setShowAnswers(!showAnswers)}>Show Answers</button>

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
