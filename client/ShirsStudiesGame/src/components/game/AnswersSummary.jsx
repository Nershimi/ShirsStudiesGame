import { useState, useEffect } from "react";
import styles from "./AnswersSummary.module.css";
import { loadLanguage } from "./../../helpers/loadLanguage.js";

export default function AnswersSummary({
  head,
  collectedQuestion,
  lang = "he",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [texts, setTexts] = useState(null);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    loadLanguage(lang, "answersSummary")
      .then((data) => {
        // console.log("Language data loaded:", data);
        setTexts(data.answersSummary);
      })
      .catch((error) => console.error("Error setting language data:", error));
  }, [lang]);

  if (!texts) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3 onClick={toggleAccordion} className={styles.accordionTitle}>
        {isOpen
          ? texts.hideAnswers || "הסתר תשובות"
          : texts.showAnswers || "הצג תשובות"}
      </h3>
      <h2>{(texts.showDetails || "Loading...") + head}</h2>
      {isOpen && (
        <div className={styles.accordionContent}>
          {collectedQuestion.map((question, index) => (
            <div key={index}>
              <h3>
                {texts.questionNum + (index + 1)}: {question.question}
              </h3>
              <h4>{texts.yourAnswer}</h4>
              <p>{question.userAnswer}</p>
              <h4>{texts.correctAnswer}</h4>
              <p>{question.correctAnswer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
