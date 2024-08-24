import "./closeButton.css";
import Button from "./Button.jsx";

export default function CloseButton({ className, onClick }) {
  return (
    <Button className={className} onClick={onClick}>
      סגור
    </Button>
  );
}
