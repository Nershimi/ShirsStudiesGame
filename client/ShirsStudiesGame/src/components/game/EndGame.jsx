import Button from "../Button.jsx";
import AnswersSummary from "./AnswersSummary.jsx";
import styles from "./EndGame.module.css";

export default function EndGame({
  correctAnswersCount,
  QuestionsAnsweredWrong,
  handleCloseDialog,
  questionsAnsweredCorrect,
  handleReset,
}) {
  return (
    <div className={styles.dialog}>
      <p>כל הכבוד הצלחת להגיע ל: {correctAnswersCount} תשובות נכונות.</p>
      <AnswersSummary
        head="שגויות"
        collectedQuestion={QuestionsAnsweredWrong}
      />
      <AnswersSummary
        head="נכונות"
        collectedQuestion={questionsAnsweredCorrect}
      />

      <Button onClick={handleReset} className={styles.closeDialogButton}>
        ResetGame
      </Button>
      <Button onClick={handleCloseDialog} className={styles.closeDialogButton}>
        Close
      </Button>
    </div>
  );
}
