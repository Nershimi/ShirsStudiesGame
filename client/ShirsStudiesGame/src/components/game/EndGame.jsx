import Button from "../Button.jsx";
import AnswersSummary from "./AnswersSummary.jsx";


export default function EndGame({
  correctAnswersCount,
  QuestionsAnsweredWrong,
  handleCloseDialog,
  questionsAnsweredCorrect,
  handleReset,
}) {
  return (
    <div>
      <p>כל הכבוד הצלחת להגיע ל: {correctAnswersCount} תשובות נכונות.</p>
      <AnswersSummary
        head="שגויות"
        collectedQuestion={QuestionsAnsweredWrong}
      />
      <AnswersSummary
        head="נכונות"
        collectedQuestion={questionsAnsweredCorrect}
      />

      <Button onClick={handleReset} className="close-dialog-button">
        ResetGame
      </Button>
      <Button onClick={handleCloseDialog} className="close-dialog-button">
        Close
      </Button>
    </div>
  );
}
