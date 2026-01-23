import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import useAuth from "../../context/useAuth";
import Input from "../../components/Input";
import Button from "../../components/Button";

Input;

const Login = () => {
  const navigate = useNavigate();
  const { token, user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect already logged-in users
  useEffect(() => {
    if (token && user) {
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    }
  }, [token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data.data;

      login(token, user);

      // Redirect after login
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";

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
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p
          onClick={() => navigate("/forgot-password")}
          className="text-sm text-blue-600 cursor-pointer mb-3"
        >
          Forgot Password?
        </p>

        <Button type="submit" loading={loading}>
          Login
        </Button>
        <p className="text-sm text-center mt-3">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
