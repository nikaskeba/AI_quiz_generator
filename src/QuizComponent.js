//QuizComponent.js
import React, { useState } from 'react';

const QuizComponent = () => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);  // New state variable
  const [feedback, setFeedback] = useState({}); // New state to store feedback for each question
const [userAnswers, setUserAnswers] = useState({});

const generateNewQuiz = async () => {
  setLoading(true);

  // Reset the feedback state
  setFeedback({});

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
    let userInput = userAnswers[index] || null;

    if (userInput === formattedAnswer) {
      newFeedback[index] = "correct";
    } else {
      newFeedback[index] = "wrong";
    }
  });

  setFeedback(newFeedback, () => {
    Object.keys(newFeedback).forEach(index => {
      let inputElement = document.getElementById(`input-${index}`);
      if (inputElement) {
        inputElement.style.borderColor = newFeedback[index] === 'correct' ? 'green' : 'red';
      }
    });
  });
};




const handleInputChange = (e, index) => {
    const updatedAnswers = { ...userAnswers, [index]: e.target.value };
    setUserAnswers(updatedAnswers);
};

const formatQuestions = (data) => {
  if (data && data.choices && data.choices[0] && data.choices[0].message) {
    const [rawContentBeforeSolutions, rawContentAfterSolutions] = data.choices[0].message.content.split('Solutions:');

    const contentBeforeSolutions = rawContentBeforeSolutions.substring(rawContentBeforeSolutions.indexOf('1.'));
    const questions = contentBeforeSolutions.split('\n');
    const contentAfterSolutions = rawContentAfterSolutions.substring(rawContentAfterSolutions.indexOf('1.'));
    const answers = contentAfterSolutions.split('\n');

    return questions.map((question, index) => {
      let questionPart = question.replace(/\((\w+)\)/, "");  // This gets the question text without the placeholder
      let placeholderMatch = question.match(/\((\w+)\)/);
      let placeholderText = placeholderMatch ? placeholderMatch[1] : "";

      return (
        <p key={index}>
          {questionPart} 
          <input 
            id={`input-${index}`} 
            placeholder={placeholderText}
            value={userAnswers[index] || ''}
            onChange={(e) => handleInputChange(e, index)}
          />
          {showAnswers && answers[index] && ` ${answers[index].replace(/^\d+\.\s*/, '')}`}
          {feedback[index] && <span className="feedback">{feedback[index]}</span>}
        </p>
      );
    });
  }
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
