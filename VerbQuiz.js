import React, { useState, useEffect} from "react";
import { Row, Button, Form, FormGroup, Label,  Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { useAuth0 } from "@auth0/auth0-react";
import emojiData from "./beginner-emoji-quiz.json";
import nounsData from "./beginner-nouns-spanish.json";
import AdjData from "./beginner-adjectives-spanish.json";
import AdverbData from "./beginner-adverbs-spanish.json";
const QuizQuestion = () => {
     const { isAuthenticated } = useAuth0();
    const [quizType, setQuizType] = useState("emoji");  // Default to emoji quiz
    const [question, setQuestion] = useState(null);
    const [ setCorrectAnswer] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

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
                data = emojiData;
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
    useEffect(generateQuiz, [quizType]);  // eslint-disable-next-line
    const handleSelection = (option) => {
        setSelectedAnswer(option);
        setHasAnswered(true);
    }

  const isCorrect = (option) => {
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
                data = emojiData;
        }
        return data[question] === option;
    }
    const handleQuizTypeChange = (type) => {
        setQuizType(type);
        setSelectedAnswer(null);
        setHasAnswered(false);
    }

    if (!isAuthenticated) {
        return null;
    }

        return (
        <div className="next-steps">
            <Row className="d-flex justify-content-center mb-4">
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle caret>
                        Select Quiz Type
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => handleQuizTypeChange("emoji")}>Emoji Quiz</DropdownItem>
                        <DropdownItem onClick={() => handleQuizTypeChange("noun")}>Nouns Quiz</DropdownItem>
                        <DropdownItem onClick={() => handleQuizTypeChange("adjective")}>Adjectives Quiz</DropdownItem>
                        <DropdownItem onClick={() => handleQuizTypeChange("adverb")}>Adverbs Quiz</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Row>
            <h2 className="text-center">{quizType.charAt(0).toUpperCase() + quizType.slice(1)} Quiz!</h2>
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