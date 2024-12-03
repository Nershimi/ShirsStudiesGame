import { useState, useEffect } from "react";
import Button from "../Button.jsx";
import CloseButton from "../CloseButton.jsx";
import styles from "./ReportQuestion.module.css";
import { loadLanguage } from "./../../helpers/loadLanguage.js";

export default function ReportQuestion({
  question,
  setReporterQuestions,
  onClose,
  lang,
}) {
  const [reportQuestion, setReportQuestion] = useState({
    questionId: question.id,
    topic: question.topic,
    typeOfReport: "",
    details: "",
  });
  const [texts, setTexts] = useState(null);

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

  useEffect(() => {
    loadLanguage(lang, "reportQuestion")
      .then((data) => {
        // console.log("Language data loaded:", data);
        setTexts(data.reportQuestion);
      })
      .catch((error) => console.error("Error setting language data:", error));
  }, [lang]);

  if (!texts) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <label htmlFor="report-type">{texts.chooseReport}</label>
        <select
          id="report-type"
          value={reportQuestion.typeOfReport}
          onChange={handleSelectChange}
        >
          <option value="" disabled>
            {texts.chooseReason || "בחר את סיבת הדיווח"}
          </option>
          <option value="בעיה בשאלה">{texts.problemInQuestion}</option>
          <option value="בעיה בתשובה">{texts.problemInAnswer}</option>
          <option value="שאלה לא רלוונטית">{texts.notRelevantQuestion}</option>
        </select>
        <div>
          <label htmlFor="report-details">{texts.writeReason}</label>
          <textarea
            id="report-details"
            placeholder={texts.pleaseWrite}
            className={styles.reportTextarea}
            value={reportQuestion.details}
            onChange={handleTextAreaChange}
          />
        </div>
        <Button className={styles.submitReportButton} onClick={handleSubmit}>
          {texts.pleaseReport}
        </Button>
        <CloseButton className={styles.closeModalButton} onClick={onClose} />
      </div>
    </div>
  );
}
