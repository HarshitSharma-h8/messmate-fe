import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import Login from "./pages/auth/Login";
import StudentDashboard from "./pages/student/StudentDashboard";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateEvent from "./pages/admin/CreateEvent";
import EventStats from "./pages/admin/EventStats";
import LiveEntries from "./pages/admin/LiveEntries";

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
                <AdminLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="stats" element={<EventStats />} />
          <Route path="entries" element={<LiveEntries />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
