export default function Input({
  type,
  value,
  name,
  onChange,
  placeholder,
  className,
}) {
  return (
    <input
      type={type}
      value={value}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  );
}
