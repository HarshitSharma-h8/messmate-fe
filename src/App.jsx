import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import Login from "./pages/auth/Login";
import StudentDashboard from "./pages/student/StudentDashboard";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <RoleRoute role="STUDENT">
                <StudentDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute role="ADMIN">
                <div>Admin Dashboard</div>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
