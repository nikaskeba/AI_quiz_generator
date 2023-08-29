//QuizComponent.js
import React, { useState } from 'react';
import './QuizComponent.css';
import axios from 'axios';
const pattern_with_prefix = /(.*?)\(([^()]+)\)([^()]+)\(([^()]+)\)/;


const QuizComponent = () => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);  // New state variable
  const [feedback, setFeedback] = useState({}); // New state to store feedback for each question
  const [quizType, setQuizType] = useState('Subjunctive'); // New state for quiz type

const [language, setLanguage] = useState('spanish');

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
    userContent = "generate 5 complete ${language} imperative sentences with the sentence verb unconjugated inside a () and the conjugated answer at the end in () for example '1.(venir) a la fiesta. (venga)'  output only sentences 1 to 5";
} else if (quizType === 'Subjunctive') {
    userContent = "generate 5 complete ${language} subjunctive sentences with the sentence verb unconjugated inside a () and the conjugated answer at the end in () for example '1. Es probable que Juan (venir) a la fiesta. (venga)'  output only sentences 1 to 5";
} else if (quizType === 'Basic Conjugation') {
    userContent = "generate 5 basic ${language} present tense sentences with the sentence verb unconjugated inside a () and the conjugated answer at the end in () for example '1. Juan (venir) a la fiesta. (viene)'  output only sentences 1 to 5";
}

    try {
const EXTERNAL_API_ENDPOINT = '/.netlify/functions/getQuizQuestions';
const payload = {
    userContent: userContent
};

const response = await axios.post(EXTERNAL_API_ENDPOINT, payload, {
    headers: {
        'Content-Type': 'application/json'
    }
});


      const data = response.data;

      setQuizData(data);
      setLoading(false);
      setShowAnswers(false);

    } catch (error) {
      console.error("Error fetching quiz data:", error);
      setLoading(false);
      setShowAnswers(false);

    }
  };



const checkAnswers = () => {
  let newFeedback = {};

  if (!quizData || !quizData.choices || !quizData.choices[0] || !quizData.choices[0].message) {
    console.error("Invalid quiz data");
    return;
  }

  const lines = quizData.choices[0].message.content.split('\n');

  lines.forEach((line, index) => {
    let match = pattern_with_prefix.exec(line);
    if (!match) return;

    let answer = match[4];  // Extracting the answer from the matched groups

    let inputElement = document.getElementById(`input-${index}`);
    let userInput = inputElement ? inputElement.value : null;

    if (userInput.toLowerCase() === answer.toLowerCase()) {

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
    let content = data.choices[0].message.content;

    const questionAnswerPairs = content.split('\n');
    
    questionAnswerPairs.forEach((pair, index) => {
      // Extract the prefix, question, and answer from the pair using the updated regex pattern
      let match = pattern_with_prefix.exec(pair);
      if (!match) return;

      let prefix = match[1].trim();
      let verb = match[2];
      let questionContent = match[3].trim();
      let answer = match[4];

      let feedbackElement = null;
      if (feedback[index]) {
        feedbackElement = <span className={`feedback ${feedback[index]}`}>{feedback[index]}</span>;
      }

let answerText = null;
if (showAnswers) {
    answerText = <span>{answer}</span>;
}

renderedQuestions.push(
    <p key={index}>
        {prefix} 
        <input id={`input-${index}`} placeholder={verb} /> 
        {questionContent} {answerText} {feedbackElement}
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
    <div className="language-selector">
  <button onClick={() => setLanguage('spanish')}>Spanish</button>
  <button onClick={() => setLanguage('german')}>German</button>
</div>
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
 <div id="output"></div>
      {loading && <p>Loading...</p>}
           {/* Display API Response for Debugging */}

    </div>
  );
};

export default QuizComponent;
