import { useEffect, useState } from "react";
import API from "../../api/api";

const LiveEntries = () => {

  const [entriesData, setEntriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchEntries = async () => {
      try {
        setLoading(true);

        const res = await API.get("/admin/entries");

        setEntriesData(res.data.data);

      } catch (err) {

        const message =
          err.response?.data?.message || "Failed to load entries";

        setError(message);

      } finally {
        setLoading(false);
      }
    };

    fetchEntries();

    // Optional auto-refresh every 10 seconds
    const interval = setInterval(fetchEntries, 10000);

    return () => clearInterval(interval);

  }, []);

  if (loading) {
    return <p>Loading live entries...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const { event, entries, totalEntries } = entriesData;

  return (
    <div>

      <h1 className="text-2xl font-bold mb-4">
        Live Entry Feed
      </h1>

      {/* Event Info */}

      <div className="bg-white p-4 rounded shadow mb-4">

        <h3 className="font-semibold">
          Event: {event.title}
        </h3>

        <p className="text-sm text-gray-600">
          Total Entries: {totalEntries}
        </p>

      </div>

      {/* Entries Table */}

      <div className="overflow-x-auto">

        <table className="w-full bg-white rounded shadow">

          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Register No</th>
              <th className="p-2 text-left">Degree</th>
              <th className="p-2 text-left">Token ID</th>
              <th className="p-2 text-left">Entry Time</th>
            </tr>
          </thead>

          <tbody>

            {entries.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-4"
                >
                  No entries yet
                </td>
              </tr>
            )}

            {entries.map((item) => (

              <tr key={item.tokenId} className="border-t">

                <td className="p-2">
                  {item.student.name}
                </td>

                <td className="p-2">
                  {item.student.registerNumber}
                </td>

                <td className="p-2">
                  {item.student.degree} -{" "}
                  {item.student.semester}
                </td>

                <td className="p-2 font-mono text-xs">
                  {item.tokenId}
                </td>

                <td className="p-2">
                  {new Date(item.entryTime).toLocaleTimeString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default LiveEntries;
