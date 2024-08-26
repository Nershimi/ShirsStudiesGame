import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Button";
import EndGame from "./EndGame.jsx";
import ReportQuestion from "./ReportQuestion.jsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from "./GameComponent.module.css";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

const GAME_LIMIT = 30;

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
  const [questionsAnsweredCorrect, setQuestionsAnsweredCorrect] = useState([]);
  const [questionsAnsweredWrong, setQuestionsAnsweredWrong] = useState([]);
  const [answerDisabled, setAnswerDisabled] = useState(false);
  const [answerCount, setAnswerCount] = useState(0);
  const [reporterQuestions, setReporterQuestions] = useState([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, you can access the userId here
        setUserId(user.uid);
      } else {
        // User is signed out
        setUserId(null);
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  const reportOnQuestions = (userId) => {
    if (!userId) return; // Ensure userId is available
    try {
      const response = fetch(
        "https://us-central1-shirsstudiesgame.cloudfunctions.net/reportAboutQuestions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId, // Include userId in the body
            question: reporterQuestions, // Rename reportedQuestions to question
          }),
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const allQuestions = location.state.questions;
    const filterQuestions = location.state.filteredQuestion;
    const questions = filterQuestions ? filterQuestions : allQuestions;
    if (Array.isArray(questions)) {
      setShuffledQuestions(shuffleArray([...questions]));
    } else {
      console.error("Questions are not in expected format:", questions);
    }
  }, [location.state?.questions]);

  useEffect(() => {
    if (answerCount === GAME_LIMIT) {
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
  }, [currentIndex, shuffledQuestions, questionsAnsweredCorrect]);

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
      setQuestionAnswered(true); // Mark question as answered
      setAnswerDisabled(true); // Disable answers after the first selection
    }
  };

  const handleNextQuestion = () => {
    const currentQuestion = shuffledQuestions[currentIndex];
    const collectedQuestion = {
      question: currentQuestion.question,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
    };
    if (answerCount < GAME_LIMIT) {
      setMessage("");
      setSelectedAnswer(null);
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % shuffledQuestions.length
      );
      if (collectedQuestion.correctAnswer !== collectedQuestion.userAnswer) {
        setQuestionsAnsweredWrong((prev) => [...prev, collectedQuestion]);
      } else {
        setQuestionsAnsweredCorrect((prev) => [...prev, collectedQuestion]);
      }
      setAnswerCount((prev) => prev + 1);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    reportOnQuestions(userId);
    navigateToHomePage();
  };

  const navigateToHomePage = () => {
    navigate("/HomePage");
  };

  const handleReportClick = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsReportModalOpen(false);
  };

  function handleReset() {
    reportOnQuestions(userId);
    const questions = location.state.questions;
    setShuffledQuestions(shuffleArray([...questions]));
    setCurrentIndex(0);
    setMessage("");
    setSelectedAnswer(null);
    setShuffledAnswers([]);
    setCorrectAnswersCount(0);
    setQuestionsAnsweredCorrect([]);
    setQuestionsAnsweredWrong([]);
    setShowDialog(false);
    setQuestionAnswered(false);
    setCorrectAnswerSelected(false);
    setAnswerDisabled(false);
    setAnswerCount(0);
  }

  if (shuffledQuestions.length === 0) return <p>אין שאלות להציג</p>;

  const currentQuestion = shuffledQuestions[currentIndex];

  return (
    <div className={styles.gameContainer}>
      <div className={styles.questionGame}>
        {showDialog ? (
          <EndGame
            correctAnswersCount={correctAnswersCount}
            handleCloseDialog={handleCloseDialog}
            questionsAnsweredCorrect={questionsAnsweredCorrect}
            QuestionsAnsweredWrong={questionsAnsweredWrong}
            handleReset={handleReset}
          />
        ) : (
          <>
            <Button onClick={navigateToHomePage} className={styles.nextButton}>
              מסך הבית
            </Button>
            <h3>
              שאלה {currentIndex + 1} מתוך {GAME_LIMIT}
            </h3>
            <h2>{currentQuestion.question}</h2>
            <div>
              {shuffledAnswers.map((answer, index) => (
                <Button
                  key={`${currentQuestion.question}-${answer}`}
                  onClick={() => handleAnswer(answer)}
                  className={`${styles.answerButton} ${
                    selectedAnswer === answer
                      ? answer === currentQuestion.correctAnswer
                        ? `${styles.answerButtonCorrect}`
                        : `${styles.answerButtonIncorrect}`
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
              className={styles.nextButton}
              disabled={!questionAnswered} // Disable button until question is answered
            >
              המשך
            </Button>
            <Button className={styles.nextButton} onClick={handleReportClick}>
              דווח על שאלה
            </Button>
            {isReportModalOpen && (
              <ReportQuestion
                question={currentQuestion}
                setReporterQuestions={setReporterQuestions}
                onClose={handleCloseModal}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionGame;
