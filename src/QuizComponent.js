//QuizComponent.js
import React, { useState } from 'react';

const QuizComponent = () => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);  // New state variable
  const [feedback, setFeedback] = useState({}); // New state to store feedback for each question

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
    let inputElement = document.getElementById(`input-${index}`);
    let userInput = inputElement ? inputElement.value : null;

    if (userInput === formattedAnswer) {
      newFeedback[index] = "correct";
      if (inputElement) {
        inputElement.style.borderColor = 'green';
      }
    } else {
      newFeedback[index] = "wrong";
      if (inputElement) {
        inputElement.style.borderColor = 'red';
      }
    }
  });

  setFeedback(newFeedback);
};


const formatQuestions = (data) => {
  if (data && data.choices && data.choices[0] && data.choices[0].message) {
    const [rawContentBeforeSolutions, rawContentAfterSolutions] = data.choices[0].message.content.split('Solutions:');

    // Extract questions and remove text before the first "1."
    const contentBeforeSolutions = rawContentBeforeSolutions.substring(rawContentBeforeSolutions.indexOf('1.'));
    const questions = contentBeforeSolutions.split('\n');

    // Start answers from the first occurrence of "1."
    const contentAfterSolutions = rawContentAfterSolutions.substring(rawContentAfterSolutions.indexOf('1.'));
    const answers = contentAfterSolutions.split('\n');
    
    return questions.map((question, index) => {
      let formattedQuestion = question.replace(/\((\w+)\)/g, `($1)`);
      let inputBox = <input id={`input-${index}`} placeholder="$1" />;
      let feedbackSpan = feedback[index] ? <span className="feedback">{feedback[index]}</span> : null;
      let answerContent = showAnswers && answers[index] ? answers[index].replace(/^\d+\.\s*/, '') : null;

      return (
        <div key={index}>
          <span dangerouslySetInnerHTML={{ __html: formattedQuestion }} />
          {inputBox}
          {answerContent && <span>{answerContent}</span>}
          {feedbackSpan}
        </div>
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
