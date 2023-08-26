import React, { useState } from 'react';

const QuizComponent = () => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false); 
  const [feedback, setFeedback] = useState({}); // New state to store feedback for each question

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

  const checkAnswers = () => {
    let newFeedback = {};

    // Assuming questions and answers have the same length.
    quizData.choices[0].message.content.split('Solutions:')[1].split('\n').forEach((answer, index) => {
      let formattedAnswer = answer.replace(/^\d+\.\s*/, '');
      let userInput = document.getElementById(`input-${index}`).value;

      if (userInput === formattedAnswer) {
        newFeedback[index] = "correct";
      } else {
        newFeedback[index] = "wrong";
      }
    });

    setFeedback(newFeedback);
  };

  const formatQuestions = (data) => {
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      const [rawContentBeforeSolutions, rawContentAfterSolutions] = data.choices[0].message.content.split('Solutions:');
      const contentBeforeSolutions = rawContentBeforeSolutions.substring(rawContentBeforeSolutions.indexOf('1.'));
      const questions = contentBeforeSolutions.split('\n');

      const contentAfterSolutions = rawContentAfterSolutions.substring(rawContentAfterSolutions.indexOf('1.'));
      const answers = contentAfterSolutions.split('\n');

      return questions.map((question, index) => {
        let formattedQuestion = question.replace(/\((\w+)\)/g, `($1) <input id="input-${index}" placeholder="$1" />`);

        if (showAnswers && answers[index]) {
          let formattedAnswer = answers[index].replace(/^\d+\.\s*/, '');
          formattedQuestion += `${formattedAnswer}`;
        }

        // Add feedback after the question if available
        if (feedback[index]) {
          formattedQuestion += ` ${feedback[index]}`;
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
      <button onClick={checkAnswers}>Check</button> {/* New "Check" button */}
      <button onClick={() => setShowAnswers(!showAnswers)}>Show Answers</button>

      {formatQuestions(quizData)}

      {loading && <p>Loading...</p>}
    </div>
  );
};

export default QuizComponent;

