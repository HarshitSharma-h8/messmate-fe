const Select = ({ label, name, value, onChange, options }) => {
  return (
    <div className="mb-3">

      {label && (
        <label className="block text-sm mb-1">
          {label}
        </label>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded bg-white"
      >

        <option value="">Select</option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}

      </select>

    </div>
  );
};

export default Select;
