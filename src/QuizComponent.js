import React, { useState } from 'react';

const QuizComponent = () => {
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userAnswers, setUserAnswers] = useState([]);

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
setApiRawResponse(data);
            
            const parsedData = parseGpt3Output(data.choices[0].message.content);
            setQuizData(parsedData.questions);
            setUserAnswers(Array(parsedData.questions.length).fill(""));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching quiz data:", error);
            setLoading(false);
        }
    };

    const parseGpt3Output = (output) => {
        const [questionsText, answersText] = output.split("Answers:");
        const questions = questionsText.trim().split("\n");
        const answers = answersText.trim().split("\n");

        return { questions, answers };
    };

    const handleInputChange = (index, event) => {
        const newAnswers = [...userAnswers];
        newAnswers[index] = event.target.value;
        setUserAnswers(newAnswers);
    };

    const checkAnswer = (index) => {
        if (userAnswers[index] === quizData.answers[index]) {
            alert('Correct!');
        } else {
            alert('Wrong answer. Try again.');
        }
    };

  return (
    <div>
        <button onClick={generateNewQuiz}>Generate New Quiz</button>
        
        {loading && <p>Loading...</p>}

        {/* Display Raw API Response */}
        {apiRawResponse && (
            <div>
                <h3>Raw API Response:</h3>
                <pre>{JSON.stringify(apiRawResponse, null, 2)}</pre>
            </div>
        )}

        {/* Display Questions */}
        {quizData && quizData.questions.map((question, index) => (
            <div key={index}>
                <span>{question.split("_______")[0]}</span>
                <input type="text" onChange={e => handleInputChange(index, e)} />
                <span>{question.split("_______")[1]}</span>
                <button onClick={() => checkAnswer(index)}>Submit</button>
            </div>
        ))}
    </div>
);

};

export default QuizComponent;

