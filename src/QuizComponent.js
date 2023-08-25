import React, { useEffect, useState } from 'react';

const QuizGenerator = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      const response = await fetch('https://api.chatgpt.com/quiz-questions', {
        method: 'POST',
        body: JSON.stringify({
          prompt: 'Generate quiz questions for Spanish subjunctive leaving the verb in its unconjugated form. List the answers at the end.',
        }),
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary authentication headers
        },
      });
      const data = await response.json();
      setQuestions(data.questions);
    };

    fetchQuizQuestions();
  }, []);

  const handleSubmission = (questionIndex, userAnswer) => {
    const correctAnswer = questions[questionIndex].answer;
    // Compare userAnswer with correctAnswer and display a message
    // indicating whether it's correct or wrong
  };

  return (
    <div>
      {questions.map((question, index) => (
        <div key={index}>
          <p>{question.sentence}</p>
          <input type="text" />
          <button onClick={() => handleSubmission(index, userAnswer)}>Submit</button>
        </div>
      ))}
    </div>
  );
};

export default QuizGenerator;