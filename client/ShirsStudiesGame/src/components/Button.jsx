export default function Button({ type, onClick, children, className, disabled }) {
  return (
    <button type={type} onClick={onClick} className={className} disabled={disabled}>
      {children}
    </button>
  );
}
