const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = true,
}) => {

  const baseStyle =
    "py-2 px-4 rounded font-medium transition focus:outline-none";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
    success:
      "bg-green-600 text-white hover:bg-green-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        ${baseStyle}
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${(loading || disabled) ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;
