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
    if (quizType === 'Subjunctive') {
      userContent = "Generate a Spanish quiz that numerically lists 5 unique Spanish subjunctive sentences. In each sentence, leave the verb without conjugation and display the verb within (). Keep the 5 generated sentences together. Write the word solution and then list the 5 conjugated verb solutions in numerical order after the questions. List only the questions and solutions with no other text.";
    } else if (quizType === 'Basic Conjugation') {
      userContent = "Generate a Spanish quiz that numerically lists 5 unique Spanish present tense sentences. In each sentence, leave the verb without conjugation and display the verb within (). Keep the 5 generated sentences together. Write the word solution and then list the 5 conjugated verb solutions with only the conjugated verb and no other text in numerical order after the questions. List only the questions and solutions with no other text.";
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

  const content = quizData.choices[0].message.content;
  const splitIndex = nthIndexOf(content, "1. ", 2);  // Find the index of the second occurrence of "1. "
  
  if (splitIndex === -1) return;  // If the format is not as expected, exit early
  
  const answersContent = content.substring(splitIndex);
  const answers = answersContent.split('\n').filter(a => a.trim() !== "").map(a => a.replace(/^\d+\.\s*/, ''));

  answers.forEach((answer, index) => {
    let inputElement = document.getElementById(`input-${index}`);
    let userInput = inputElement ? inputElement.value : null;

    if (userInput === answer) {
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
    const content = data.choices[0].message.content;
    console.log(content);
index = nthIndexOf(content, "1. ", 2);  // Find the index of the second occurrence of "1. "
    if (splitIndex === -1) return;  // Early return if the format is not as expected
    
    const questionsContent = content.substring(0, splitIndex).trim();
    const answersContent = content.substring(splitIndex).trim();

    const questions = questionsContent.split('\n').filter(q => q.trim() !== ""); // Assuming 5 questions
    const answers = answersContent.split('\n').filter(a => a.trim() !== "");  // Assuming 5 answers

    questions.forEach((question, index) => {
  // Split the question around the placeholder
  let parts = question.split(/\((\w+)\)/g);
console.log(parts);

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

// Helper function to find the nth occurrence of a substring
function nthIndexOf(string, substring, n) {
  let times = 0;
  let index = 0;

  while (times < n && index !== -1) {
    index = string.indexOf(substring, index + 1);
    times++;
  }

  return index;
}


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
      </div>

      <button onClick={generateNewQuiz}>Generate New Quiz</button>
      <button onClick={checkAnswers}>Check</button>
      <button onClick={() => setShowAnswers(!showAnswers)}>Show Answers</button>

      {formatQuestions(quizData)}

      {loading && <p>Loading...</p>}
    </div>
);
};
export default QuizComponent;
