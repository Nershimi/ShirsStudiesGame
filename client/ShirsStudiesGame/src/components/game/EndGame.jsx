import Button from "../Button.jsx";
import AnswersSummary from "./AnswersSummary.jsx";
import styles from "./EndGame.module.css";
import { loadLanguage } from "./../../helpers/loadLanguage.js";
import { useState, useEffect } from "react";

export default function EndGame({
  correctAnswersCount,
  QuestionsAnsweredWrong,
  handleCloseDialog,
  questionsAnsweredCorrect,
  handleReset,
  lang = "he",
}) {
  const [texts, setTexts] = useState(null);

  useEffect(() => {
    loadLanguage(lang, "endGame")
      .then((data) => {
        // console.log("Language data loaded:", data);
        setTexts(data.endGame);
      })
      .catch((error) => console.error("Error setting language data:", error));
  }, [lang]);

  if (!texts) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.dialog}>
      <p>
        {" "}
        {texts.numberOfSuccesses +
          correctAnswersCount +
          texts.correctAnswer}{" "}
      </p>
      <AnswersSummary
        head="שגויות"
        collectedQuestion={QuestionsAnsweredWrong}
      />
      <AnswersSummary
        head="נכונות"
        collectedQuestion={questionsAnsweredCorrect}
      />

      <Button onClick={handleReset} className={styles.closeDialogButton}>
        {texts.resetGame}
      </Button>
      <Button onClick={handleCloseDialog} className={styles.closeDialogButton}>
        {texts.close}
      </Button>
    </div>
  );
}
