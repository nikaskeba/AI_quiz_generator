//QuizComponent.js
import React, { useState } from 'react';

const QuizComponent = () => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);  // New state variable
   const [userAnswers, setUserAnswers] = useState({}); // New state to hold user answers

  const [feedback, setFeedback] = useState({}); // New state to hold feedback for each answer

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

  const handleInputChange = (index, event) => {
    setUserAnswers(prev => ({ ...prev, [index]: event.target.value }));
  };

  const handleSubmit = (index, correctAnswer) => {
    if (userAnswers[index] === correctAnswer) {
      setFeedback(prev => ({ ...prev, [index]: 'correct' }));
    } else {
      setFeedback(prev => ({ ...prev, [index]: 'incorrect' }));
    }
  };

  const formatQuestions = (data) => {
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      const sentences = data.choices[0].message.content.split('\n');
      return sentences.map((sentence, index) => {
        if (index < 5) {
          const match = sentence.match(/\((\w+)\)/);
          const correctAnswer = match ? match[1] : null;
          const formattedSentence = sentence.replace(/\((\w+)\)/g, (match, word) => 
            `(${word}) <input 
                          style={{ borderColor: feedback[index] === 'correct' ? 'green' : feedback[index] === 'incorrect' ? 'red' : '' }} 
                          onChange={(e) => handleInputChange(index, e)} 
                          placeholder="${word}" 
                       /> 
                       <button onClick={() => handleSubmit(index, correctAnswer)}>Submit</button>`
          );
          return (
            <p key={index} dangerouslySetInnerHTML={{ __html: formattedSentence }} />
          );
        }
        return showAnswers ? <p key={index}>{sentence}</p> : null;
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
      {/*quizData && (
        <pre>{JSON.stringify(quizData, null, 2)}</pre>
      )*/}
    </div>
  );
};

export default QuizComponent;
