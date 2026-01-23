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

      // Move to OTP screen
      navigate(`/verify-otp?email=${form.email}`);
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";

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
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <Select
          label="Role"
          name="role"
          value={form.role}
          onChange={handleChange}
          options={ROLE_OPTIONS}
        />

        <Input
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <Input
          label="Register Number"
          name="registerNumber"
          value={form.registerNumber}
          onChange={handleChange}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <Input
          label="Mobile"
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <Input
          label="Mess ID"
          name="messId"
          value={form.messId}
          onChange={handleChange}
        />

        <Select
          label="Gender"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          options={GENDER_OPTIONS}
        />

        {form.role === "STUDENT" && (
          <>
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
          </>
        )}

        {form.role === "ADMIN" && (
          <Input
            label="Admin Secret Key"
            type="password"
            name="adminSecret"
            value={form.adminSecret}
            onChange={handleChange}
          />
        )}

        <Button type="submit" loading={loading} variant="success">
          Register
        </Button>
        
        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
