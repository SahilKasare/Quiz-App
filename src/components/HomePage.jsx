import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ quizData, setUserName }) => { 
  const [inputName, setInputName] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleStartQuiz = (e) => {
    e.preventDefault();
    
    if (!inputName.trim()) {
      setError('Please enter your name to continue');
      return;
    }

    const formattedName = inputName.trim();
    if (formattedName.length < 3) {
      setError('Name must be at least 3 characters long');
      return;
    }

    if (formattedName.length > 50) {
      setError('Name must not exceed 50 characters');
      return;
    }

    setUserName(formattedName); 
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Quiz Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-4">
              Welcome to the Quiz App!
            </h1>
            <div className="h-1 w-32 bg-blue-500 mx-auto mb-8"></div>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4">
              {quizData.title}
            </h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-lg text-gray-600">
              <div className="flex items-center">
                <span className="font-semibold mr-2">Topic:</span>
                {quizData.topic}
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">Duration:</span>
                15 minutes
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">Questions:</span>
                {quizData.questions.length}
              </div>
            </div>
          </div>

          <form onSubmit={handleStartQuiz} className="max-w-md mx-auto">
            <div className="mb-6">
              <label 
                htmlFor="name" 
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Please enter your name to begin
              </label>
              <input
                type="text"
                id="name"
                value={inputName}
                onChange={(e) => {
                  setInputName(e.target.value);
                  setError('');
                }}
                className={`block w-full px-4 py-3 border ${
                  error ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="Enter your name"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>

            <div className="mb-8 text-left bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Quiz Rules:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>You will have 15 minutes to complete the quiz</li>
                <li>Each correct answer earns you {quizData.correct_answer_marks} points</li>
                <li>Each wrong answer deducts {quizData.negative_marks} points</li>
                <li>You cannot return to previous questions</li>
                <li>Results will be shown after completion</li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg 
                       font-semibold text-lg hover:bg-blue-600 
                       transform transition-all duration-200 
                       hover:scale-105 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start Quiz
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;