import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, TextInput,  FlatList, TouchableOpacity  } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import spanishAdjectiveData from './data/adjectives-spanish.json'; // Import the data from the adjectives-spanish.js
import spanishAdverbData from './data/adverbs-spanish.json'; // Import the data from the adjectives-spanish.js
import spanishEmojiData from './data/emoji-spanish.json'; // Import the data from the adjectives-spanish.js
import spanishNounData from './data/nouns-spanish.json'; // Import the data from the adjectives-spanish.js

import spanishQuizData from './data/spanishquiz.json';

const quizOptions = [
    { value: 'Select', label: 'Select' },
    { value: 'Subjunctive', label: 'Subjunctive' },
    { value: 'Conjugation', label: 'Conjugation' },
    { value: 'Imperative', label: 'Imperative' },
    { value: 'emoji', label: 'Emoji' },
    { value: 'noun', label: 'Noun' },
    { value: 'adjective', label: 'Adjective' },
    { value: 'adverb', label: 'Adverb' }
];

const QuizComponent = ({ name, email }) => {
    const [correctAnswer, setCorrectAnswer] = useState(null);

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showAnswersVisibility, setShowAnswersVisibility] = useState(false);
const [answerCorrectness, setAnswerCorrectness] = useState([]);
 const [correctSpanish] = useState(null);
const inputRefs = useRef([]);
const [answersChecked, setAnswersChecked] = useState(false);
const [userAnswers, setUserAnswers] = useState([]);
useEffect(() => {
    setUserAnswers(formattedQuestions.map(() => ""));
}, [formattedQuestions]);
const [showQuiz, setShowQuiz] = useState(false);
const [hasSelected, setHasSelected] = useState(false);
const [quizQuestion, setQuizQuestion] = useState("");
const [quizAnswer, setQuizAnswer] = useState([]);     const [selectedOption, setSelectedOption] = useState('Select');
     const setLanguage = "spanish";
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({});
    const [quizData, setQuizData] = useState(null);
    const [showAnswers, setShowAnswers] = useState(false);
  const [formattedQuestions, setFormattedQuestions] = useState([]);
    const [userEmail, setUserEmail] = useState('example@email.com'); // Dummy for now
    const [difficulty, setDifficulty] = useState('beginner'); // Dummy for now, you may want to change this
const [quizType, setQuizType] = useState('Subjunctive');


const handleStartQuiz = () => {
    setShowAnswersVisibility(false);
setAnswersChecked(false);

    if (!spanishQuizData[difficulty] || !spanishQuizData[difficulty][quizType]) {
        alert("No quiz data available for the selected difficulty and type.");
        return;
    }
    
    const availableSentences = spanishQuizData[difficulty][quizType];
    if (availableSentences.length < 5) {
        alert("Not enough sentences available for the selected difficulty and type.");
        return;
    }
    
    const selectedSentences = [];
    while (selectedSentences.length < 5) {
        const randomIndex = Math.floor(Math.random() * availableSentences.length);
        if (!selectedSentences.includes(availableSentences[randomIndex])) {
            selectedSentences.push(availableSentences[randomIndex]);
        }
    }
    
    setFormattedQuestions(selectedSentences);
    setAnswerCorrectness([]);
};

    useEffect(() => {
        const fetchUserPreferences = async () => {
            try {
                if (!email) return; // Use email directly
                const response = await fetch(`https://skeba.info/netlify/get-biography.php?email=${email}`);
                const data = await response.json();
                if (data) {
        
                    setDifficulty(data.difficulty || "beginner");
                
                    console.log(data.difficulty);
                }
            } catch (error) {
                console.error('Error fetching user preferences:', error);
            }
        };

        fetchUserPreferences();
    }, [email]);
const generateQuizAdj = () => {
console.log(selectedOption);
let dataGroup
if (selectedOption === "adjective") { // Use '===' for strict equality checking
    dataGroup = spanishAdjectiveData[difficulty];
}
if (selectedOption === "adverb") { // Use '===' for strict equality checking
    dataGroup = spanishAdverbData[difficulty];
}
if (selectedOption === "emoji") { // Use '===' for strict equality checking
    dataGroup = spanishEmojiData[difficulty];
}
if (selectedOption === "noun") { // Use '===' for strict equality checking
    dataGroup = spanishNounData[difficulty];
}
    if (!dataGroup || dataGroup.length === 0) {
        alert("No quiz data available for the selected difficulty and type.");
        return;
    }

  // Randomly select an object from the dataGroup
    const randomDataIndex = Math.floor(Math.random() * dataGroup.length);
    const data = dataGroup[randomDataIndex];

    // Convert data to array of [spanish, english] pairs
    const pairs = Object.entries(data);

    // Randomly select a pair for the correct answer
    const randomIndex = Math.floor(Math.random() * pairs.length);
    const [correctSpanish, correctEnglish] = pairs[randomIndex];

    // Remove the correct answer from the list
    pairs.splice(randomIndex, 1);

    // Randomly select 3 distractors
    const distractors = [];
    for (let i = 0; i < 3; i++) {
        const distractorIndex = Math.floor(Math.random() * pairs.length);
        distractors.push(pairs[distractorIndex][0]);
        pairs.splice(distractorIndex, 1);
    }

    // Create an array with the correct answer and the distractors
    const options = [correctSpanish, ...distractors];

    // Shuffle the options
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
console.log("correct",correctEnglish);
console.log("correct",correctSpanish);
console.log(options);
setCorrectAnswer(correctSpanish);
    // Convert to constants
    const newQuest = correctEnglish;
    const newOptions = options;
setQuizQuestion(newQuest);
setQuizAnswer(newOptions);
console.log("question", setCorrectAnswer);
   console.log("answer",newOptions);
setShowQuiz(true);
};  
const handleCheckAnswers = () => {
    if (answersChecked) {
        setAnswerCorrectness([]); // Clear the answer correctness array
    } else {
        const correctnessArray = formattedQuestions.map((question, index) => {
            const userAnswer = (userAnswers[index] || "").toLowerCase();
            const correctAnswer = (question.answer || "").toLowerCase();
            return userAnswer === correctAnswer;
        });
        setAnswerCorrectness(correctnessArray);
    }
    setAnswersChecked(prevState => !prevState); // Toggle the answersChecked state
};

const renderAdjectiveQuiz = () => {

    if (!quizQuestion) return null;
console.log("correctspanish",correctSpanish);
   const isCorrect = (option) => hasSelected && option === selectedAnswer && option === correctAnswer;
const isIncorrect = (option) => hasSelected && option === selectedAnswer && option !== correctAnswer;


    return (
        <View style={{ marginVertical: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {quizQuestion}
            </Text>
            <FlatList
                data={quizAnswer}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => {
                            setSelectedAnswer(item);
                            setHasSelected(true);
                                    console.log("Selected:", item);
        console.log("Correct:", correctSpanish);
                        }}
                        style={{
                            padding: 10,
                            backgroundColor: isCorrect(item) ? 'green' : (isIncorrect(item) ? 'red' : 'transparent')
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};



    return (
<View style={styles.container}>



            <Text style={styles.header}>Quiz Options</Text>
          <Picker
    selectedValue={selectedOption}
    onValueChange={(itemValue) => {
        setSelectedOption(itemValue);
        setQuizType(itemValue);
                setFormattedQuestions([]); // Reset the formattedQuestions state when a new option is selected

    }}
    style={{ ...styles.picker, height: 50, width: 200, backgroundColor: '#f8f8f8' }}
>
    {quizOptions.map(option => (
        <Picker.Item 
            key={option.value} 
            label={option.label} 
            value={option.value} 
            style={styles.pickerItem} 
        />
    ))}
</Picker>
{(selectedOption === "adjective" || selectedOption === "adverb" || selectedOption === "noun" || selectedOption === "emoji") && (
    <View>
        <Button title="Generate Quiz" onPress={generateQuizAdj} />
        {showQuiz && renderAdjectiveQuiz()}
    </View>
)}
            {(selectedOption === "Conjugation" || selectedOption === "Imperative" || selectedOption === "Subjunctive") && (
         <Button title="Start Quiz" onPress={handleStartQuiz} />


            )}
         


   {formattedQuestions.map((question, index) => {
                const [start, middle, end] = question.sentence.split(/[\(\)]/);
                return (
                    <View key={index} style={{ flexDirection: 'column', alignItems: 'flex-start', marginVertical: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>{start}</Text>
                            <TextInput
                                ref={el => inputRefs.current[index] = el}
                                value={userAnswers[index] || ""} // Ensure value is never undefined or null
                                onChangeText={(text) => {
                                    const updatedAnswers = [...userAnswers];
                                    updatedAnswers[index] = text;
                                    setUserAnswers(updatedAnswers);
                                }}
                                style={{ 
                                    borderWidth: 1, 
                                    borderColor: 'gray', 
                                    paddingHorizontal: 5, 
                                    marginHorizontal: 5,
                                    backgroundColor: answerCorrectness[index] === true ? 'green' : (answerCorrectness[index] === false ? 'red' : 'white')
                                }}
                                placeholder={middle}
                            />
                            <Text>{end}</Text>
                        </View>
                        {showAnswersVisibility && <Text style={{ marginTop: 5 }}>Answer: {question.answer.charAt(0).toUpperCase() + question.answer.slice(1)}</Text>}
                    </View>
                );
            })}

            {formattedQuestions.length > 0 && (
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                    <View style={{ marginRight: 5, }}>
                        <Button title={answersChecked ? "Reset Answers" : "Check Answers"} onPress={handleCheckAnswers} />
                    </View>
                    <Button title={showAnswersVisibility ? "Hide Answers" : "Show Answers"} onPress={() => setShowAnswersVisibility(prevState => !prevState)} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    picker: {
        width: 250,
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: '#f8f8f8',
    },
    pickerItem: {
        fontSize: 18,
    },
    input: {
        width: 200,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    listItem: {
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ddd',
    },
    correctAnswer: {
        backgroundColor: 'green',
    },
    incorrectAnswer: {
        backgroundColor: 'red',
    },
    Button: {
        backgroundColor: 'red',
    },
});

export default QuizComponent;
