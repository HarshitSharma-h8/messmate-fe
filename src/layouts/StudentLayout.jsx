import { Link, NavLink, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";
import { useTheme } from "../context/ThemeProvider";

const StudentLayout = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navClass = ({ isActive }) =>
    [
      "rounded-lg px-3 py-2 transition",
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-200 hover:bg-gray-800 hover:text-white",
    ].join(" ");

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Mobile / Tablet Header */}
      <div className="lg:hidden border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between gap-3">
          <Link to="/student" className="text-lg font-bold text-gray-900 dark:text-white">
            Mess Student
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="btn-secondary px-3 py-2 text-sm"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>

            <button
              onClick={logout}
              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full border-b border-gray-800 bg-gray-900 text-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
          <div className="hidden lg:flex items-center justify-between p-4">
            <h2 className="text-lg font-bold">Mess Student</h2>

            <button
              onClick={toggleTheme}
              className="rounded-lg border border-gray-700 px-3 py-1 text-sm text-gray-200 hover:bg-gray-800"
            >
              {theme === "dark" ? "☀" : "🌙"}
            </button>
          </div>

          <nav className="flex flex-wrap gap-2 p-4 lg:flex-col lg:gap-3">
            <NavLink to="/student" end className={navClass}>
              Dashboard
            </NavLink>

            <NavLink to="/student/help" className={navClass}>
              Help
            </NavLink>

            <button
              onClick={logout}
              className="hidden text-left mt-2 rounded-lg px-3 py-2 text-red-400 transition hover:bg-gray-800 hover:text-red-300 lg:block"
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-4 sm:p-5 lg:p-6 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;