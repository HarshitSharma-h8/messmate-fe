import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Select from "../../components/Select";
import {
  DEGREE_OPTIONS,
  SEMESTER_OPTIONS,
  GENDER_OPTIONS,
  ROLE_OPTIONS,
} from "../../utils/constants";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    registerNumber: "",
    email: "",
    mobile: "",
    password: "",
    role: "STUDENT",
    degree: "",
    semester: "",
    gender: "",
    messId: "",
    adminSecret: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await API.post("/auth/register", form);
      navigate(`/verify-otp?email=${form.email}`);
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
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
            <h1 className="text-4xl font-bold leading-tight">Create your MessMate account</h1>
            <p className="mt-4 text-lg text-blue-100">
              Register as a student or admin to access mess events, token generation, and gate entry features.
            </p>

            <div className="mt-8 space-y-4 text-sm text-blue-50">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                Students can generate a QR token for active mess events.
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                Admins can create events, scan entries, and monitor live activity.
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold">Register</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Fill in your details to create an account
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Select
                  label="Role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  options={ROLE_OPTIONS}
                />

                <Select
                  label="Gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  options={GENDER_OPTIONS}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />

                <Input
                  label="Register Number"
                  name="registerNumber"
                  value={form.registerNumber}
                  onChange={handleChange}
                  placeholder="Enter register number"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />

                <Input
                  label="Mobile"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                />

                <Input
                  label="Mess ID"
                  name="messId"
                  value={form.messId}
                  onChange={handleChange}
                  placeholder="Enter mess ID"
                />
              </div>

              {form.role === "STUDENT" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Select
                    label="Degree"
                    name="degree"
                    value={form.degree}
                    onChange={handleChange}
                    options={DEGREE_OPTIONS}
                  />

                  <Select
                    label="Semester"
                    name="semester"
                    value={form.semester}
                    onChange={handleChange}
                    options={SEMESTER_OPTIONS}
                  />
                </div>
              )}

              {form.role === "ADMIN" && (
                <Input
                  label="Admin Secret Key"
                  type="password"
                  name="adminSecret"
                  value={form.adminSecret}
                  onChange={handleChange}
                  placeholder="Enter admin secret key"
                />
              )}

              <Button type="submit" loading={loading} variant="success">
                Register
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;