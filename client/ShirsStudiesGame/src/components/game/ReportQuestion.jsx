import { useState, useEffect } from "react";
import Button from "../Button.jsx";
import CloseButton from "../CloseButton.jsx";
import styles from "./ReportQuestion.module.css";
import { loadLanguage } from "./../../helpers/loadLanguage.js";
import Select from "react-select";

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

  const handleSelectChange = (selectedOption) => {
    setReportQuestion((prev) => ({
      ...prev,
      typeOfReport: selectedOption ? selectedOption.value : "",
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
        <Select
          options={texts.options}
          onChange={handleSelectChange}
          aria-labelledby="report-type"
        />

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
