import { Link, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";

const StudentLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-lg font-bold mb-6">Mess Student</h2>

        <nav className="flex flex-col gap-3">
          <Link to="/student" className="hover:text-blue-400">
            Dashboard
          </Link>
          <Link to="/student/help" className="hover:text-blue-400">
            Help
          </Link>

          {/* Optional: add later */}
          {/* <Link to="/student/history" className="hover:text-blue-400">History</Link> */}

          <button
            onClick={logout}
            className="text-left mt-4 text-red-400 hover:text-red-500"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
