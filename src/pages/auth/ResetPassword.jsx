import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/api";
import Input from "../../components/Input";

const ResetPassword = () => {

  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await API.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      setSuccess("Password updated successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {

      const message =
        err.response?.data?.message || "Reset failed";

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

        <h2 className="text-xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-2">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 text-sm mb-2">
            {success}
          </p>
        )}

        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

      </form>

    </div>
  );
};

export default ResetPassword;
