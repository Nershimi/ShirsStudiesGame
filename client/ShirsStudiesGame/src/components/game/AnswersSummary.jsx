import { useState } from "react";
import styles from "./AnswersSummary.module.css";

export default function AnswersSummary({ head, collectedQuestion }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <h3 onClick={toggleAccordion} className={styles.accordionTitle}>
        {isOpen ? "הסתר תשובות" : "הצג תשובות"}
      </h3>
      <h2>להלן פירוט התשובות ה{head}</h2>
      {isOpen && (
        <div className={styles.accordionContent}>
          {collectedQuestion.map((question, index) => (
            <div key={index}>
              <h3>
                שאלה מס' {index + 1}: {question.question}
              </h3>
              <h4>התשובה שלך היא:</h4>
              <p>{question.userAnswer}</p>
              <h4>התשובה הנכונה היא:</h4>
              <p>{question.correctAnswer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
