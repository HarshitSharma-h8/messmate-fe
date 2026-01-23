import { useState } from "react";
import API from "../../api/api";
import Input from "../../components/Input";
import Button from "../../components/Button";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await API.post("/auth/forgot-password", { email });

      setSuccess("Reset link sent to your email");

    } catch (err) {
      const message = err.response?.data?.message || "Request failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" loading={loading} variant="primary">
          Send Reset Link
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
