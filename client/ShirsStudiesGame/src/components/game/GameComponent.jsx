import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Button";
import "./GameComponent.css";
import EndGame from "./EndGame.jsx";

// TODO: fix count of correct answered
// TODO: debug next question - why user can continue without answer?
// TODO: find way to avoid repeated questions.

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

const QuestionGame = () => {
  const location = useLocation();
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [correctAnswerSelected, setCorrectAnswerSelected] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState([]);
  const [answerDisabled, setAnswerDisabled] = useState(false); // Track if answers are disabled
  const navigate = useNavigate();

  useEffect(() => {
    const questions = location.state.questions;
    setShuffledQuestions(shuffleArray([...questions]));
  }, [location.state.questions]);

  const navigateToHomePage = () => {
    navigate("/HomePage");
  };

  useEffect(() => {
    if (questionsAnswered.length === 30) {
      setShowDialog(true);
    } else if (shuffledQuestions.length > 0) {
      const currentQuestion = shuffledQuestions[currentIndex];
      const allAnswers = [
        currentQuestion.correctAnswer,
        ...currentQuestion.wrongAnswers,
      ];
      setShuffledAnswers(allAnswers.sort(() => Math.random() - 0.5));
      setQuestionAnswered(false);
      setCorrectAnswerSelected(false);
      setAnswerDisabled(false); // Enable answers when a new question is loaded
    }
  }, [currentIndex, shuffledQuestions, questionsAnswered]);

  const handleAnswer = (answer) => {
    if (!questionAnswered) {
      if (answer === shuffledQuestions[currentIndex].correctAnswer) {
        if (!correctAnswerSelected) {
          setMessage("כל הכבוד, תשובה נכונה!");
          setCorrectAnswersCount((prev) => prev + 1);
          setCorrectAnswerSelected(true);
        }
      } else {
        setMessage("תשובה לא נכונה, לא נורא תצליח בפעם הבאה");
      }
      setSelectedAnswer(answer);
      // setQuestionAnswered(true); // Mark question as answered
      // setAnswerDisabled(true); // Disable answers after the first selection
    }
  };

  const handleNextQuestion = () => {
    const collectedQuestion = {
      question: currentQuestion.question,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
    };
    if (questionsAnswered.length < 30) {
      setMessage("");
      setSelectedAnswer(null);
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % shuffledQuestions.length
      );
      setQuestionsAnswered((prev) => [...prev, collectedQuestion]);
      setQuestionAnswered(true);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    navigateToHomePage();
  };

  function handleReset() {
    const questions = location.state.questions;
    setShuffledQuestions(shuffleArray([...questions]));
    setCurrentIndex(0);
    setMessage("");
    setSelectedAnswer(null);
    setShuffledAnswers([]);
    setCorrectAnswersCount(0);
    setQuestionsAnswered([]);
    setShowDialog(false);
    setQuestionAnswered(false);
    setCorrectAnswerSelected(false);
    setAnswerDisabled(false);
  }

  if (shuffledQuestions.length === 0) return <p>אין שאלות להציג</p>;

  const currentQuestion = shuffledQuestions[currentIndex];

  return (
    <div className="game-container">
      <div className="question-game">
        {showDialog ? (
          <EndGame
            correctAnswersCount={correctAnswersCount}
            handleCloseDialog={handleCloseDialog}
            collectedQuestion={questionsAnswered}
            handleReset={handleReset}
          />
        ) : (
          <>
            <Button onClick={navigateToHomePage} className="next-button">
              מסך הבית
            </Button>
            <h3>שאלה {currentIndex + 1} מתוך 30</h3>
            <h2>{currentQuestion.question}</h2>
            <div>
              {shuffledAnswers.map((answer, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(answer)}
                  className={`answer-button ${
                    selectedAnswer === answer
                      ? answer === currentQuestion.correctAnswer
                        ? "correct"
                        : "incorrect"
                      : ""
                  }`}
                  disabled={answerDisabled}
                >
                  {answer}
                </Button>
              ))}
            </div>
            {message && <p>{message}</p>}
            <Button
              onClick={handleNextQuestion}
              className="next-button"
              // disabled={!questionAnswered} // Disable button until question is answered
            >
              המשך
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionGame;
