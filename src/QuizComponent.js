//QuizComponent.js
import React, { useState } from 'react';
import './QuizComponent.css';
const QuizComponent = () => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);  // New state variable
  const [feedback, setFeedback] = useState({}); // New state to store feedback for each question

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


const checkAnswers = () => {
  let newFeedback = {};

  // Split the content at "Solutions:"
  const solutionContent = quizData.choices[0].message.content.split('Solutions:')[1];
  // Start from the first occurrence of "1."
  const answersContent = solutionContent.substring(solutionContent.indexOf('1.'));
  const answers = answersContent.split('\n');

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
    const [rawContentBeforeSolutions, rawContentAfterSolutions] = data.choices[0].message.content.split('Solutions:');
    const contentBeforeSolutions = rawContentBeforeSolutions.substring(rawContentBeforeSolutions.indexOf('1.'));
    const questions = contentBeforeSolutions.split('\n');
    const contentAfterSolutions = rawContentAfterSolutions.substring(rawContentAfterSolutions.indexOf('1.'));
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
    let formattedAnswer = answers[index].replace(/^\d+\.\s*/, '');
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



  return (
  <div>
    <button onClick={generateNewQuiz}>Generate New Quiz</button>
    <button onClick={checkAnswers}>Check</button>
    <button onClick={() => setShowAnswers(!showAnswers)}>Show Answers</button>

    {formatQuestions(quizData)}

    {loading && <p>Loading...</p>}
  </div>
  );
};
export default QuizComponent;
