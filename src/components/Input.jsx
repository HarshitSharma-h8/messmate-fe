const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="mb-3">

      {label && (
        <label className="block text-sm mb-1">
          {label}
        </label>
      )}

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

    </div>
  );
};

export default Input;
