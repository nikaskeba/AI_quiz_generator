//QuizComponent.js
import React, { useState } from 'react';
import './QuizComponent.css';
import axios from 'axios';
const pattern_with_prefix = /(.*?)\(([^()]+)\)([^()]+)\(([^()]+)\)/;


const QuizComponent = ({ difficulty, language }) => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);  // New state variable
  const [feedback, setFeedback] = useState({}); // New state to store feedback for each question
  const [quizType, setQuizType] = useState('Subjunctive')

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
    userContent = `generate 5 complete ${language} ${difficulty} imperative sentences with the ${language} sentence verb unconjugated inside a () and the conjugated ${language} answer at the end in () for example '1.(venir) a la fiesta. (venga)'  output only sentences 1 to 5`;
} else if (quizType === 'Subjunctive') {
    userContent = `generate 5 complete ${language} ${difficulty} subjunctive sentences with the ${language} sentence verb unconjugated inside a () and the conjugated ${language} answer at the end in () for example '1. Es probable que Juan (venir) a la fiesta. (venga)'  output only sentences 1 to 5`;
} else if (quizType === 'Basic Conjugation') {
    userContent = `generate 5 basic ${language} ${difficulty} present tense sentences with the ${language} sentence verb unconjugated inside a () and the conjugated ${language} answer at the end in () for example '1. Juan (venir) a la fiesta. (viene)'  output only sentences 1 to 5`;
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

    } 
      catch (error) {
        console.error("Error fetching quiz data:", error);
        console.error("Error response:", error.response);
        setLoading(false);
        setShowAnswers(false);
    }
    
  };



  const checkAnswers = () => {
    let newFeedback = {};
  
    if (quizData && quizData.choices && quizData.choices[0] && quizData.choices[0].message && quizData.choices[0].message.content) {
      let lines = quizData.choices[0].message.content.split('\n');
  
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
  
    } else {
      console.error('quizData structure is not as expected:', quizData);
      return;
    }
  
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
} else {
console.error('Data structure is not as expected:', data);
}
return renderedQuestions;
};

function handleQuizTypeChange(type) {
  setQuizType(type);
}




return (
    <div>
     
     
      <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {quizType}
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <button className="dropdown-item" onClick={() => handleQuizTypeChange('Subjunctive')}>Subjunctive</button>
                <button className="dropdown-item" onClick={() => handleQuizTypeChange('Conjugation')}>Conjugation</button>
                <button className="dropdown-item" onClick={() => handleQuizTypeChange('Imperative')}>Imperative</button>
              </div>
            </div>

   
<h1 className="quiz-header">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} {language.charAt(0).toUpperCase() + language.slice(1)} {quizType} Quiz</h1>
<button onClick={generateNewQuiz}>Generate New Quiz</button>
      <button onClick={checkAnswers}>Check</button>
      <button onClick={() => setShowAnswers(!showAnswers)}>Show Answers</button>
   

      {loading && <p>Loading...</p>}
      {quizData && formatQuestions(quizData).map((question, index) => (
      <React.Fragment key={index}>
        {question}
      </React.Fragment>
    ))}
     <div id="output"></div>
           {/* Display API Response for Debugging */}

    </div>
  );
};

export default QuizComponent;
