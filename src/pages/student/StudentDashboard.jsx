import { useEffect, useMemo, useState } from "react";
import API from "../../api/api";
import useAuth from "../../context/useAuth";
import { QRCodeCanvas } from "qrcode.react";
import Button from "../../components/Button";

function safeDate(x) {
  const d = x ? new Date(x) : null;
  return d && !isNaN(d.getTime()) ? d : null;
}

function fmtDT(x) {
  const d = safeDate(x);
  return d ? d.toLocaleString() : "—";
}

function fmtTime(x) {
  const d = safeDate(x);
  return d
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "—";
}

function Badge({ children, type = "gray" }) {
  const cls =
    type === "green"
      ? "border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
      : type === "red"
      ? "border-red-200 bg-red-100 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
      : type === "amber"
      ? "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
      : "border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}

const StudentDashboard = () => {
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [tokenData, setTokenData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const statusBadge = useMemo(() => {
    const s = (tokenData?.status || "").toUpperCase();
    if (s === "USED") return { type: "amber", label: "USED" };
    if (s === "EXPIRED") return { type: "red", label: "EXPIRED" };
    if (s === "UNUSED") return { type: "green", label: "UNUSED" };
    return { type: "gray", label: s || "—" };
  }, [tokenData]);

  const fetchData = async () => {
    try {
      setError("");
      setNotice("");
      setLoading(true);

      const eventRes = await API.get("/events/active");
      setEvent(eventRes.data.data);

      try {
        const tokenRes = await API.get("/tokens/my");
        setTokenData(tokenRes.data.data);
      } catch {
        setTokenData(null);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateToken = async () => {
    try {
      setNotice("");
      setError("");
      setActionLoading(true);

      const res = await API.post("/tokens/generate");
      setTokenData(res.data.data);
      setNotice("✅ Token generated. Show this QR at the entry gate.");
    } catch (err) {
      setError(err?.response?.data?.message || "Token generation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const copyTokenId = async () => {
    const tokenId = tokenData?.tokenId;
    if (!tokenId) return;

    try {
      await navigator.clipboard.writeText(String(tokenId));
      setNotice("✅ Token ID copied");
    } catch {
      setNotice("Copy failed (browser blocked clipboard)");
    }
  };

  const qrValue = useMemo(() => {
    if (!tokenData?.tokenId) return "";

    const payload = {
      tokenId: tokenData.tokenId,
      name: user?.name || "",
      registerNumber: user?.registerNumber || user?.regNo || "",
      degree: user?.degree || "",
      semester: user?.semester || "",
    };

    return JSON.stringify(payload);
  }, [tokenData?.tokenId, user]);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Student Dashboard
        </h1>

        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>

        <div className="mt-4">
          <Button type="button" onClick={fetchData} fullWidth={false}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 md:text-3xl">
          Welcome, {user?.name || "Student"}
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Generate your pass and show the QR at the mess entry gate.
        </p>
      </div>

      {(error || notice) && (
        <div
          className={`mb-6 rounded-xl border p-4 ${
            error
              ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
              : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
          }`}
        >
          <div className="font-medium">{error ? "There’s a problem" : "Update"}</div>
          <div className="mt-1 text-sm">{error || notice}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 xl:col-span-2">
          {/* Student Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Your Details
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These details appear with your token.
                </p>
              </div>

              <Button
                type="button"
                onClick={fetchData}
                variant="secondary"
                fullWidth={false}
              >
                Refresh
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 text-sm">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
                <div className="text-gray-500 dark:text-gray-400">Name</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {user?.name || "—"}
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
                <div className="text-gray-500 dark:text-gray-400">Register Number</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {user?.registerNumber || user?.regNo || "—"}
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
                <div className="text-gray-500 dark:text-gray-400">Degree</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {user?.degree || "—"}
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
                <div className="text-gray-500 dark:text-gray-400">Semester</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {user?.semester || "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Event Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Active Event
            </h2>

            {!event ? (
              <div className="mt-3 text-gray-600 dark:text-gray-400">
                No active event right now.
              </div>
            ) : (
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {event.title}
                  </div>
                  <Badge>ACTIVE</Badge>
                </div>

                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Window:
                  </span>{" "}
                  {fmtDT(event.startTime)} → {fmtDT(event.endTime)}
                </div>
              </div>
            )}
          </div>

          {/* Token Actions */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Your Token
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Generate only once per active event.
                </p>
              </div>

              {!tokenData ? (
                <Button
                  type="button"
                  onClick={generateToken}
                  disabled={actionLoading || !event}
                  fullWidth={false}
                >
                  {actionLoading ? "Generating..." : "Generate Token"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={copyTokenId}
                  variant="secondary"
                  fullWidth={false}
                >
                  Copy Token ID
                </Button>
              )}
            </div>

            {!tokenData ? (
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
                No token generated yet.
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Token Info
                    </div>
                    <Badge type={statusBadge.type}>{statusBadge.label}</Badge>
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    <div className="break-all text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Token ID:
                      </span>{" "}
                      <span className="font-mono">{tokenData.tokenId}</span>
                    </div>

                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Slot:
                      </span>{" "}
                      {fmtTime(tokenData.slot?.startTime)} → {fmtTime(tokenData.slot?.endTime)}
                    </div>

                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Generated:
                      </span>{" "}
                      {fmtDT(tokenData.generatedAt)}
                    </div>

                    {tokenData.usedAt && (
                      <div className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Used At:
                        </span>{" "}
                        {fmtDT(tokenData.usedAt)}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    Tip: Keep brightness high for fast scanning.
                  </div>
                </div>

                {/* Gate Pass */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Gate Pass QR
                  </div>

                  <div className="mt-3 flex flex-col items-center justify-center gap-3">
                    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-white">
                      <QRCodeCanvas
                        value={qrValue || String(tokenData.tokenId)}
                        size={window.innerWidth < 640 ? 160 : 190}
                      />
                    </div>

                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
                      <div className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                        Student
                      </div>
                      <div>
                        Name: <span className="font-medium">{user?.name || "—"}</span>
                      </div>
                      <div>
                        Reg No:{" "}
                        <span className="font-medium">
                          {user?.registerNumber || user?.regNo || "—"}
                        </span>
                      </div>
                      <div>
                        Degree/Sem:{" "}
                        <span className="font-medium">
                          {user?.degree || "—"} / {user?.semester || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="xl:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm xl:sticky xl:top-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Quick Summary
            </h3>

            <div className="mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <div className="text-gray-500 dark:text-gray-400">Event</div>
                <div className="font-semibold">{event?.title || "—"}</div>
              </div>

              <div>
                <div className="text-gray-500 dark:text-gray-400">Event Window</div>
                <div className="font-semibold">
                  {event ? `${fmtTime(event.startTime)} → ${fmtTime(event.endTime)}` : "—"}
                </div>
              </div>

              <div>
                <div className="text-gray-500 dark:text-gray-400">Token Status</div>
                <div className="mt-1">
                  <Badge type={statusBadge.type}>{statusBadge.label}</Badge>
                </div>
              </div>

              <div className="pt-2 text-xs text-gray-500 dark:text-gray-400">
                If the scanner can’t read the QR, use “Copy Token ID” and show it to the admin.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;