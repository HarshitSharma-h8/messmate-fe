import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import useAuth from "../../context/useAuth";
import Input from "../../components/Input";
import Button from "../../components/Button";

const Login = () => {
  const navigate = useNavigate();
  const { token, user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left side */}
        <div className="hidden lg:flex flex-col justify-center bg-blue-600 px-10 xl:px-16 text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight">Welcome back to MessMate</h1>
            <p className="mt-4 text-blue-100 text-lg">
              Manage events, generate tokens, and verify mess entry in one place.
            </p>

            <div className="mt-8 space-y-4 text-sm text-blue-50">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                Admins can create events, scan entries, and monitor stats.
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                Students can generate QR-based entry tokens for active events.
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold">Login</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Sign in to continue to your dashboard
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot Password?
                </button>
              </div>

              <Button type="submit" loading={loading}>
                Login
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;