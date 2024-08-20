import { useState } from "react";
import Button from "../Button.jsx";

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
      typeofReport: event.target.value,
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
    <div className="modal-overlay">
      <div className="modal-content">
        <label htmlFor="report-type">בחר סיבת דיווח:</label>
        <select
          id="report-type"
          value={reportQuestion.typeofReport}
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
        <label htmlFor="report-details">אנא פרט את הסיבה:</label>
        <textarea
          id="report-details"
          placeholder="אנא כתוב בפירוט מה הבעיה ומה נדרש לתקן"
          className="report-textarea"
          value={reportQuestion.details}
          onChange={handleTextAreaChange}
        />
        <Button onClick={handleSubmit}>דווח על השאלה</Button>
      </div>
    </div>
  );
}
