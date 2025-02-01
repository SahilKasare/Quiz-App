import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';

function App() {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/quiz')
      .then(response => {
        setQuizData(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching quiz data.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage quizData={quizData} setUserName={setUserName} />} />
        <Route path="/quiz" element={<QuizPage quizData={quizData} userName={userName} />} />
      </Routes>
    </Router>
  );
}

export default App;
