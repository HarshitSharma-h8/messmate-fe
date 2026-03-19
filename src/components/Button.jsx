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
    "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-950";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300",
    secondary:
      "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus:ring-gray-700",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-300",
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
        ${(loading || disabled) ? "cursor-not-allowed opacity-60" : ""}
      `}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;