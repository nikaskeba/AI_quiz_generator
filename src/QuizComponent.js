const QuizComponent = () => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

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

  const checkAnswer = (inputIndex, answer) => {
    const inputElem = document.getElementById(`answer-input-${inputIndex}`);
    if (inputElem) {
      if (inputElem.value === answer.trim()) {  // Using trim() to remove potential extra spaces
        inputElem.style.backgroundColor = 'green';
      } else {
        inputElem.style.backgroundColor = 'red';
      }
    }
  };

  const formatQuestions = (data) => {
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      const [rawContentBeforeSolutions, rawContentAfterSolutions] = data.choices[0].message.content.split('Solutions:');
      const questions = rawContentBeforeSolutions.split('\n');
      const answers = rawContentAfterSolutions.split('\n').filter(answer => answer);

      return questions.slice(0, answers.length).map((question, index) => {
        const formattedQuestion = question.replace(/\((\w+)\)/g, (_, match) => {
          return `(${match}) <input id="answer-input-${index}" placeholder="${match}" />`;
        });
        
        const displayAnswer = showAnswers ? ` Answer: ${answers[index]}` : '';
        
        return (
          <div key={index}>
            <p dangerouslySetInnerHTML={{ __html: formattedQuestion + displayAnswer }} />
            <button onClick={() => checkAnswer(index, answers[index])}>
              Check Answer
            </button>
          </div>
        );
      });
    }
    return null;
  };

  return (
    <div>
      <button onClick={generateNewQuiz}>Generate New Quiz</button>
      <button onClick={() => setShowAnswers(!showAnswers)}>Show Answers</button>
      {formatQuestions(quizData)}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default QuizComponent;

