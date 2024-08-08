import Button from "../Button";

export default function EndGame({
  correctAnswersCount,
  handleCloseDialog,
  collectedQuestion,
  handleReset
}) {
  return (
    <div className="dialog">
      <p>כל הכבוד הצלחת להגיע ל: {correctAnswersCount} תשובות נכונות.</p>
      <h2>להלן פירוט התשובות</h2>
      {collectedQuestion.map((question, index) => (
        <div key={index}>
          <h3>
            שאלה מס'{index + 1} {question.question}
          </h3>
          <h4>התשובה שלך היא:</h4>
          <p>{question.userAnswer}</p>
          <h4>התשובה הנכונה היא:</h4>
          <p>{question.correctAnswer}</p>
        </div>
      ))}

      <Button onClick={handleReset} className="close-dialog-button">
        ResetGame
      </Button>
      <Button onClick={handleCloseDialog} className="close-dialog-button">
        Close
      </Button>
    </div>
  );
}
