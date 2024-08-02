import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './GameComponent.css';

const QuestionGame = () => {
  const location = useLocation();
  const questions = location.state.questions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  useEffect(() => {
    const currentQuestion = questions[currentIndex];
    const allAnswers = [currentQuestion.correctAnswer, ...currentQuestion.wrongAnswers];
    setShuffledAnswers(allAnswers.sort(() => Math.random() - 0.5));
  }, [currentIndex, questions]);

  const handleAnswer = (answer) => {
    const correctAnswer = questions[currentIndex].correctAnswer;
    setSelectedAnswer(answer);
    if (answer === correctAnswer) {
      setMessage('נכון!');
    } else {
      setMessage('לא נכון!');
    }
  };

  const handleNextQuestion = () => {
    setMessage('');
    setSelectedAnswer(null);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % questions.length);
  };

  if (questions.length === 0) return <p>אין שאלות להציג</p>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="question-game">
      <h2>{currentQuestion.question}</h2>
      <div>
        {shuffledAnswers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(answer)}
            className={`answer-button ${
              selectedAnswer === answer
                ? answer === currentQuestion.correctAnswer
                  ? 'correct'
                  : 'incorrect'
                : ''
            }`}
          >
            {answer}
          </button>
        ))}
      </div>
      {message && <p>{message}</p>}
      <button onClick={handleNextQuestion} className="next-button">המשך</button>
    </div>
  );
};

export default QuestionGame;
