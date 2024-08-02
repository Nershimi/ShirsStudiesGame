export default function Input({
  type,
  value,
  name,
  onChange,
  placeholder,
  className,
  error,
}) {
  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type={type}
        value={value}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
}
