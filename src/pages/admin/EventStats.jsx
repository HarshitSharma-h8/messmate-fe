import { useEffect, useState } from "react";
import API from "../../api/api";

const EventStats = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchStats = async () => {
      try {
        setLoading(true);

        const res = await API.get("/admin/event-stats");

        setData(res.data.data);

      } catch (err) {

        const message =
          err.response?.data?.message || "Failed to load stats";

        setError(message);

      } finally {
        setLoading(false);
      }
    };

    fetchStats();

  }, []);

  if (loading) {
    return <p>Loading stats...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const { event, stats } = data;

  return (
    <div>

      <h1 className="text-2xl font-bold mb-4">
        Event Statistics
      </h1>

      {/* Event Info */}
      <div className="bg-white p-4 rounded shadow mb-4">

        <h3 className="font-semibold">
          {event.title}
        </h3>

        <p className="text-sm text-gray-600">
          {new Date(event.startTime).toLocaleString()} -{" "}
          {new Date(event.endTime).toLocaleString()}
        </p>

      </div>

      {/* Stats Cards */}

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

export default EventStats;
