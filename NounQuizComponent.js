//NounQuizComponent.js
import React, { useState, useEffect } from "react";
import { Row, Button, Form, FormGroup, Label} from "reactstrap";
import { useAuth0 } from "@auth0/auth0-react";
import emojiData from "./beginner-emoji-quiz.json";
import nounsData from "./beginner-nouns-spanish.json";
import AdjData from "./beginner-adjectives-spanish.json";
import AdverbData from "./beginner-adverbs-spanish.json";
const QuizQuestion = (props) => {
    const { quizType } = props;

     const { isAuthenticated } = useAuth0();

    const [question, setQuestion] = useState(null);
    // eslint-disable-next-line
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);
  




const generateQuiz = () => {
    let data;
switch (quizType) {
    case "emoji":
        data = emojiData;
        break;
    case "noun":
        data = nounsData;
        break;
    case "adjective":
        data = AdjData;
        break;
    case "adverb":
        data = AdverbData;
        break;
    default:
        console.error("Unexpected quizType:", quizType);  // Log an error for unexpected quiz types
        return;  // Exit the function early if the quizType is unexpected
}
    const randomKey = Object.keys(data)[Math.floor(Math.random() * Object.keys(data).length)];
    const randomValue = data[randomKey];

    setCorrectAnswer(randomValue);
    setQuestion(randomKey);

    const allAnswers = Object.values(data);
    const index = allAnswers.indexOf(randomValue);
    if (index > -1) {
        allAnswers.splice(index, 1);
    }

    const incorrectAnswers = [];
    while (incorrectAnswers.length < 4) {
        const randomIndex = Math.floor(Math.random() * allAnswers.length);
        const randomIncorrectAnswer = allAnswers[randomIndex];
        if (!incorrectAnswers.includes(randomIncorrectAnswer)) {
            incorrectAnswers.push(randomIncorrectAnswer);
        }
    }

    const combinedOptions = [randomValue, ...incorrectAnswers];
    combinedOptions.sort(() => Math.random() - 0.5);

    setOptions(combinedOptions);
    setSelectedAnswer(null);
    setHasAnswered(false);
};

  // eslint-disable-next-line
    useEffect(generateQuiz, [quizType]);

    const handleSelection = (option) => {
        setSelectedAnswer(option);
        setHasAnswered(true);
    }

const isCorrect = (option) => {
    let data;
    switch (props.quizType) {  // Use props.quizType here
        case "emoji":
            data = emojiData;
            break;
        case "noun":
            data = nounsData;
            break;
        case "adjective":
            data = AdjData;
            break;
        case "adverb":
            data = AdverbData;
            break;
        default:
            data = emojiData;
    }
    return data[question] === option;
}


    if (!isAuthenticated) {
        return null;
    }

        return (
        <div className="next-steps">
        
         
            <Row className="d-flex justify-content-center mb-4">
                <h1>{question}</h1>
            </Row>
            <Form>
                {options.map((option, i) => (
                    <FormGroup key={i} check>
                        <Label 
                            style={{
                                color: hasAnswered ? (option === selectedAnswer ? (isCorrect(option) ? "green" : "red") : (isCorrect(option) ? "green" : "black")) : "black",
                                cursor: "pointer",
                                display: "block",
                                padding: "5px 10px",
                                border: "1px solid transparent",
                                borderRadius: "5px",
                                marginBottom: "5px",
                                backgroundColor: option === selectedAnswer ? "#f5f5f5" : "transparent"
                            }}
                            onClick={() => !hasAnswered && handleSelection(option)}
                        >
                            {option}
                        </Label>
                    </FormGroup>
                ))}
                {hasAnswered &&
                    <Button color="primary" onClick={generateQuiz}>
                        Next
                    </Button>
                }
            </Form>
        </div>
    );
};




export default QuizQuestion;