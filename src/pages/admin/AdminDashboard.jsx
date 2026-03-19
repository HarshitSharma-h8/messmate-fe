import { useEffect, useMemo, useState } from "react";
import API from "../../api/api";
import Button from "../../components/Button";

function fmtDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/admin/event-stats");
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "No active event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const statsCards = useMemo(() => {
    if (!data?.stats) return [];

    return [
      {
        label: "Total Tokens",
        value: data.stats.totalTokens,
        className:
          "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300",
      },
      {
        label: "Used",
        value: data.stats.usedTokens,
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
      },
      {
        label: "Unused",
        value: data.stats.unusedTokens,
        className:
          "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
      },
      {
        label: "Expired",
        value: data.stats.expiredTokens,
        className:
          "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
      },
    ];
  }, [data]);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100 md:text-3xl">
          Admin Dashboard
        </h1>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          <div className="font-medium">No active dashboard data</div>
          <div className="mt-1 text-sm">{error}</div>
        </div>

        <div className="mt-4">
          <Button type="button" onClick={fetchDashboard} fullWidth={false}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { event, stats } = data;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 md:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Monitor the active event and overall token usage.
        </p>
      </div>

      {/* Active Event Card */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Active Event
            </h2>
            <p className="mt-2 text-base font-medium text-gray-900 dark:text-gray-100">
              {event?.title || "—"}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {fmtDateTime(event?.startTime)} - {fmtDateTime(event?.endTime)}
            </p>
          </div>

          <Button
            type="button"
            onClick={fetchDashboard}
            variant="secondary"
            fullWidth={false}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((item) => (
          <div
            key={item.label}
            className={`rounded-xl border p-4 shadow-sm ${item.className}`}
          >
            <p className="text-sm opacity-80">{item.label}</p>
            <h2 className="mt-2 text-2xl font-bold">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Extra summary */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Quick Summary
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Event Name
            </div>
            <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {event?.title || "—"}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Processed
            </div>
            <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {(stats?.usedTokens || 0) + (stats?.expiredTokens || 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;