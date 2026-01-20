import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/StudentDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<Login />} />

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
