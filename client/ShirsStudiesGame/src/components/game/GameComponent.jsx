import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Button";
import "./GameComponent.css";

const QuestionGame = () => {
  const location = useLocation();
  const questions = location.state.questions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [correctAnswerSelected, setCorrectAnswerSelected] = useState(false); // Track if correct answer has been selected
  const navigate = useNavigate();

  const navigateToHomePage = () => {
    navigate("/HomePage");
  };

  useEffect(() => {
    if (questionsAnswered === 30) {
      setShowDialog(true);
    } else if (questions.length > 0) {
      const currentQuestion = questions[currentIndex];
      const allAnswers = [
        currentQuestion.correctAnswer,
        ...currentQuestion.wrongAnswers,
      ];
      setShuffledAnswers(allAnswers.sort(() => Math.random() - 0.5));
      setQuestionAnswered(false); // Reset question answered status
      setCorrectAnswerSelected(false); // Reset correct answer selected status
    }
  }, [currentIndex, questions, questionsAnswered]);

  const handleAnswer = (answer) => {
    if (!questionAnswered) {
      if (answer === questions[currentIndex].correctAnswer) {
        if (!correctAnswerSelected) {
          setMessage("נכון!");
          setCorrectAnswersCount((prev) => prev + 1);
          setCorrectAnswerSelected(true); // Mark correct answer as selected
        }
      } else {
        setMessage("לא נכון!");
      }
      setSelectedAnswer(answer); // Update selected answer for visual feedback
    }
  };

  const handleNextQuestion = () => {
    if (questionsAnswered < 30) {
      setMessage("");
      setSelectedAnswer(null);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % questions.length);
      setQuestionsAnswered((prev) => prev + 1);
      setQuestionAnswered(true); // Mark the question as answered
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    navigateToHomePage();

    // Optionally, you can reset the game or redirect to another page here
  };

  if (questions.length === 0) return <p>אין שאלות להציג</p>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="question-game">
      {showDialog ? (
        <div className="dialog">
          <p>כל הכבוד הצלחת להגיע ל: {correctAnswersCount} תשובות נכונות.</p>
          <Button onClick={handleCloseDialog} className="close-dialog-button">
            Close
          </Button>
        </div>
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
              >
                {answer}
              </Button>
            ))}
          </div>
          {message && <p>{message}</p>}
          <Button onClick={handleNextQuestion} className="next-button">
            המשך
          </Button>
        </>
      )}
    </div>
  );
};

export default QuestionGame;
