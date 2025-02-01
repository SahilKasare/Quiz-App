import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizPage = ({ quizData , userName}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(900); // 15 minutes timer
  const [startTime] = useState(new Date());
  const [timeTaken, setTimeTaken] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [userAnswers, setUserAnswers] = useState(
    new Array(quizData.questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Update current date time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted = now.toISOString().replace('T', ' ').slice(0, 19);
      setCurrentDateTime(formatted);
    };

    updateDateTime();
    const dateTimer = setInterval(updateDateTime, 1000);

    return () => clearInterval(dateTimer);
  }, []);

  useEffect(() => {
    if (timer === 0 || quizCompleted) {
      handleQuizCompletion();
      return;
    }
    
    const timerId = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timer, quizCompleted]);

  const handleAnswerSelection = (selectedOption, index) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = {
        selected: selectedOption,
        isCorrect: selectedOption.is_correct,
        optionIndex: index
      };
      return newAnswers;
    });

    if (selectedOption.is_correct) {
      setScore(prevScore => prevScore + parseFloat(quizData.correct_answer_marks));
    } else {
      setScore(prevScore => prevScore - parseFloat(quizData.negative_marks));
    }

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizCompletion();
    }
  };

  const handleQuizCompletion = () => {
    if (!quizCompleted) {
      const endTime = new Date();
      const timeSpent = Math.floor((endTime - startTime) / 1000);
      setTimeTaken(timeSpent);
      setQuizCompleted(true);
      setShowResults(true);
    }
  };

  const calculateResults = () => {
    const correctAnswers = userAnswers.filter(answer => answer?.isCorrect).length;
    const wrongAnswers = userAnswers.filter(answer => answer && !answer.isCorrect).length;
    const unattempted = userAnswers.filter(answer => answer === null).length;

    return {
      timeTaken,
      correctAnswers,
      wrongAnswers,
      unattempted
    };
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const QuestionReview = ({ question, index, userAnswer }) => {
    const isCorrect = userAnswer?.isCorrect;
    const selectedOptionIndex = userAnswer?.optionIndex;

    return (
      <div className="mb-8 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold mb-2">
          Question {index + 1}: {question.description}
        </h3>
        <div className="space-y-2">
          {question.options.map((option, optIndex) => (
            <div
              key={optIndex}
              className={`p-3 rounded-lg transition-colors ${
                selectedOptionIndex === optIndex
                  ? isCorrect
                    ? 'bg-green-200 border-green-300'
                    : 'bg-red-200 border-red-300'
                  : option.is_correct
                  ? 'bg-green-100 border-green-200'
                  : 'bg-gray-100 border-gray-200'
              } border`}
            >
              <span className="font-medium mr-2">
                {String.fromCharCode(65 + optIndex)}.
              </span>
              {option.description}
            </div>
          ))}
        </div>
        {!isCorrect && userAnswer && (
          <p className="mt-3 text-green-600 font-medium">
            Correct Answer: {
              question.options.find(opt => opt.is_correct).description
            }
          </p>
        )}
      </div>
    );
  };

  if (showResults) {
    const results = calculateResults();
    
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{userName}, Lets check your Quiz Results </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-blue-800">Time Taken</p>
              <p className="text-xl">{formatTime(results.timeTaken)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-semibold text-green-800">Final Score</p>
              <p className="text-xl">{score} points</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="font-semibold text-emerald-800">Correct Answers</p>
              <p className="text-xl text-emerald-600">{results.correctAnswers}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-semibold text-red-800">Wrong Answers</p>
              <p className="text-xl text-red-600">{results.wrongAnswers}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-800">Accuracy</p>
              <p className="text-xl">
                {Math.round((results.correctAnswers / quizData.questions.length) * 100)}%
              </p>
            </div>
            {results.unattempted > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="font-semibold text-yellow-800">Unattempted</p>
                <p className="text-xl text-yellow-600">{results.unattempted}</p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-6 pb-2 border-b">
              Detailed Review
            </h3>
            {quizData.questions.map((question, index) => (
              <QuestionReview
                key={index}
                question={question}
                index={index}
                userAnswer={userAnswers[index]}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => window.print()}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Print Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quiz</h1>
          <div className="text-right">
            <p className="text-lg font-medium px-4 py-2 bg-blue-100 rounded-lg mt-2">
              Time Left: {formatTime(timer)}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">
              Question {currentQuestionIndex + 1} of {quizData.questions.length}
            </h2>
            
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-lg mb-4">{quizData.questions[currentQuestionIndex].description}</p>
          <div className="space-y-3">
            {quizData.questions[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelection(option, index)}
                className="block w-full text-left p-4 rounded-lg border border-gray-200 
                         hover:border-blue-500 hover:bg-blue-50 transition-colors
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="font-medium mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option.description}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
          <p>
            Correct answer: +{quizData.correct_answer_marks} points
          </p>
          <p>
            Wrong answer: -{quizData.negative_marks} points
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;