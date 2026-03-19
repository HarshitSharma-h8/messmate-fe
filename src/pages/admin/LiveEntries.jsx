import { useEffect, useState } from "react";
import API from "../../api/api";
import Button from "../../components/Button";

function fmtTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

const LiveEntries = () => {
  const [entriesData, setEntriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/admin/entries");
      setEntriesData(res.data.data);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load entries";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();

    const interval = setInterval(fetchEntries, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading live entries...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100 md:text-3xl">
          Live Entry Feed
        </h1>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          <div className="font-medium">Could not load live entries</div>
          <div className="mt-1 text-sm">{error}</div>
        </div>

        <div className="mt-4">
          <Button type="button" onClick={fetchEntries} fullWidth={false}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { event, entries, totalEntries } = entriesData;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 md:text-3xl">
            Live Entry Feed
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Monitor verified entries in real time. This page refreshes automatically every 10 seconds.
          </p>
        </div>

        <Button
          type="button"
          onClick={fetchEntries}
          variant="secondary"
          fullWidth={false}
        >
          Refresh
        </Button>
      </div>

      {/* Event Info */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Active Event
        </h2>

        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="text-sm text-gray-500 dark:text-gray-400">Event Name</div>
            <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {event?.title || "—"}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Entries</div>
            <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {totalEntries ?? 0}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 lg:hidden">
        {entries.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center text-sm text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
            No entries yet
          </div>
        ) : (
          entries.map((item) => (
            <div
              key={item.tokenId}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {item.student?.name || "—"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.student?.registerNumber || "—"}
                  </div>
                </div>

                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {fmtTime(item.entryTime)}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 text-sm">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Degree / Semester</div>
                  <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                    {item.student?.degree || "—"} - {item.student?.semester || "—"}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Token ID</div>
                  <div className="mt-1 break-all font-mono text-xs text-gray-900 dark:text-gray-100">
                    {item.tokenId}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:block">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Name
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Register No
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Degree
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Token ID
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Entry Time
              </th>
            </tr>
          </thead>

          <tbody>
            {entries.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-sm text-gray-600 dark:text-gray-400"
                >
                  No entries yet
                </td>
              </tr>
            )}

            {entries.map((item) => (
              <tr
                key={item.tokenId}
                className="border-t border-gray-200 dark:border-gray-800"
              >
                <td className="p-3 text-sm text-gray-900 dark:text-gray-100">
                  {item.student?.name || "—"}
                </td>

                <td className="p-3 text-sm text-gray-900 dark:text-gray-100">
                  {item.student?.registerNumber || "—"}
                </td>

                <td className="p-3 text-sm text-gray-900 dark:text-gray-100">
                  {item.student?.degree || "—"} - {item.student?.semester || "—"}
                </td>

                <td className="p-3 font-mono text-xs text-gray-700 dark:text-gray-300">
                  {item.tokenId}
                </td>

                <td className="p-3 text-sm text-gray-900 dark:text-gray-100">
                  {fmtTime(item.entryTime)}
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