import { useState } from "react";
import Button from "../Button.jsx";
import CloseButton from "../CloseButton.jsx";
import styles from "./ReportQuestion.module.css";

export default function ReportQuestion({
  question,
  setReporterQuestions,
  onClose,
}) {
  const [reportQuestion, setReportQuestion] = useState({
    questionId: question.id,
    topic: question.topic,
    typeOfReport: "",
    details: "",
  });

  const handleSelectChange = (event) => {
    setReportQuestion((prev) => ({
      ...prev,
      typeOfReport: event.target.value,
    }));
  };

  const handleTextAreaChange = (event) => {
    setReportQuestion((prev) => ({
      ...prev,
      details: event.target.value,
    }));
  };

  const handleSubmit = () => {
    setReporterQuestions((prev) => [...prev, reportQuestion]);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <label htmlFor="report-type">בחר סיבת דיווח:</label>
        <select
          id="report-type"
          value={reportQuestion.typeOfReport}
          onChange={handleSelectChange}
        >
          <option value="" disabled>
            בחר את סיבת הדיווח
          </option>
          <option value="בעיה בשאלה">יש בעיה בשאלה - ניסוח/רלוונטיות</option>
          <option value="בעיה בתשובה">
            יש בעיה בתשובות - תשובה לא נכונה/ניסוח
          </option>
          <option value="שאלה לא רלוונטית">שאלה לא רלוונטית לנושא</option>
        </select>
        <div>
          <label htmlFor="report-details">אנא פרט את הסיבה:</label>
          <textarea
            id="report-details"
            placeholder="אנא כתוב בפירוט מה הבעיה ומה נדרש לתקן"
            className={styles.reportTextarea}
            value={reportQuestion.details}
            onChange={handleTextAreaChange}
          />
        </div>
        <Button className={styles.submitReportButton} onClick={handleSubmit}>
          דווח על השאלה
        </Button>
        <CloseButton className={styles.closeModalButton} onClick={onClose} />
      </div>
    </div>
  );
}
