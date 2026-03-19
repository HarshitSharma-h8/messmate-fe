const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="
          w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5
          text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200
          disabled:cursor-not-allowed disabled:opacity-60
          dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500
          dark:focus:border-blue-400 dark:focus:ring-blue-900/40
        "
      />
    </div>
  );
};

export default Input;