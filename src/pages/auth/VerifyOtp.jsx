import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../api/api";
import Input from "../../components/Input";
import Button from "../../components/Button";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const email = params.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "OTP verification failed";

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
        <h2 className="text-xl font-bold mb-4 text-center">Verify OTP</h2>

        <p className="text-sm mb-3 text-center">OTP sent to {email}</p>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <Input
          label="OTP"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <Button type="submit" loading={loading}>
          Verify
        </Button>
      </form>
    </div>
  );
};

export default VerifyOtp;
