import { useEffect, useState } from "react";
import API from "../../api/api";

const AdminDashboard = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await API.get("/admin/event-stats");

        setData(res.data.data);

      } catch (err) {

        setError(
          err.response?.data?.message || "No active event"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();

  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-3">
          Admin Dashboard
        </h1>

        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  const { event, stats } = data;

  return (
    <div>

      <h1 className="text-2xl font-bold mb-4">
        Admin Dashboard
      </h1>

      {/* Active Event Card */}

      <div className="bg-white p-4 rounded shadow mb-4">

        <h3 className="font-semibold text-lg">
          Active Event
        </h3>

        <p className="mt-1">
          {event.title}
        </p>

        <p className="text-sm text-gray-600">
          {new Date(event.startTime).toLocaleString()}
          {" "} - {" "}
          {new Date(event.endTime).toLocaleString()}
        </p>

      </div>

      {/* Stats Summary */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-blue-100 p-4 rounded">
          <p className="text-sm">Total Tokens</p>
          <h2 className="text-xl font-bold">
            {stats.totalTokens}
          </h2>
        </div>

        <div className="bg-green-100 p-4 rounded">
          <p className="text-sm">Used</p>
          <h2 className="text-xl font-bold">
            {stats.usedTokens}
          </h2>
        </div>

        <div className="bg-yellow-100 p-4 rounded">
          <p className="text-sm">Unused</p>
          <h2 className="text-xl font-bold">
            {stats.unusedTokens}
          </h2>
        </div>

        <div className="bg-red-100 p-4 rounded">
          <p className="text-sm">Expired</p>
          <h2 className="text-xl font-bold">
            {stats.expiredTokens}
          </h2>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
