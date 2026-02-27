import { Link, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";

const AdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-lg font-bold mb-6">Mess Admin</h2>

        <nav className="flex flex-col gap-3">
          <Link to="/admin" className="hover:text-blue-400">
            Dashboard
          </Link>

          <Link to="/admin/create-event" className="hover:text-blue-400">
            Create Event
          </Link>

          <Link to="/admin/stats" className="hover:text-blue-400">
            Event Stats
          </Link>

          <Link to="/admin/entries" className="hover:text-blue-400">
            Live Entries
          </Link>

          <Link to="/admin/scan" className="hover:text-blue-400">
            Scan Entry
          </Link>

          <Link to="/admin/help" className="hover:text-blue-400">
            Help
          </Link>
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

export default AdminLayout;
