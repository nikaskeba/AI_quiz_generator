import React, { useEffect, useState } from 'react';
let userAnswer; 


const QuizGenerator = () => {
  const [questions, setQuestions] = useState([]);
  
useEffect(() => {
    const fetchQuizQuestions = async () => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        body: JSON.stringify({
          model: "gpt-4-0314",
          messages: [
            {"role": "system", "content": "You are a spanish teacher"},
            {"role": "user", "content": "Generate quiz questions for Spanish subjunctive leaving the verb in its unconjugated form. List the answers at the end."}
          ],
          max_tokens: 120,
          stop: null,
          temperature: 0.7,
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer OPENAI_API_KEY' // replace with your API key or use environment variables for security
        },
      });
      const data = await response.json();
      // Depending on the API's response format, you might need to adjust how you extract the questions
      setQuestions(data.choices[0].message.content.split('\n')); // Example way to split by newline
    };

    fetchQuizQuestions();
}, []);

const handleSubmission = (questionIndex, userAnswer) => {
    const correctAnswer = questions[questionIndex].answer;
    if (userAnswer === correctAnswer) {
        alert("Correct!");
    } else {
        alert("Wrong!");
    }
};

return (
    <div>
      {questions.map((question, index) => (
        <div key={index}>
          <p>{question.sentence}</p>
          <input 
            type="text" 
            onChange={e => userAnswer = e.target.value} 
          />
          <button onClick={() => handleSubmission(index, userAnswer)}>Submit</button>
        </div>
      ))}
    </div>
  );
};

export default QuizGenerator;