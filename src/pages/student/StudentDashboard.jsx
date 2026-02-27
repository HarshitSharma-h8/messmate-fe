import { useEffect, useMemo, useState } from "react";
import API from "../../api/api";
import useAuth from "../../context/useAuth";
import { QRCodeCanvas } from "qrcode.react";

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
  return d ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";
}

function Badge({ children, type = "gray" }) {
  const cls =
    type === "green"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : type === "red"
      ? "bg-red-100 text-red-800 border-red-200"
      : type === "amber"
      ? "bg-amber-100 text-amber-800 border-amber-200"
      : "bg-slate-100 text-slate-800 border-slate-200";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>
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

  // QR payload: includes student details + tokenId (scanner/admin can extract tokenId easily)
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
    return <div className="min-h-screen bg-slate-50 p-6">Loading...</div>;
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-semibold text-slate-900">Student Dashboard</h1>
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
          <button
            onClick={fetchData}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Welcome, {user?.name || "Student"}
          </h1>
          <p className="mt-1 text-slate-600">
            Generate your pass and show the QR at the mess entry gate.
          </p>
        </div>

        {(error || notice) && (
          <div
            className={`mb-6 rounded-xl border p-4 ${
              error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            <div className="font-medium">{error ? "There’s a problem" : "Update"}</div>
            <div className="mt-1 text-sm">{error || notice}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Card */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Your Details</h2>
                  <p className="text-sm text-slate-600">These details appear with your token.</p>
                </div>
                <button
                  onClick={fetchData}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                >
                  Refresh
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                  <div className="text-slate-500">Name</div>
                  <div className="font-semibold text-slate-900">{user?.name || "—"}</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                  <div className="text-slate-500">Register Number</div>
                  <div className="font-semibold text-slate-900">
                    {user?.registerNumber || "—"}
                    {console.log(user)}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                  <div className="text-slate-500">Degree</div>
                  <div className="font-semibold text-slate-900">{user?.degree || "—"}</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                  <div className="text-slate-500">Semester</div>
                  <div className="font-semibold text-slate-900">{user?.semester || "—"}</div>
                </div>
              </div>
            </div>

            {/* Event Card */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Active Event</h2>

              {!event ? (
                <div className="mt-3 text-slate-600">No active event right now.</div>
              ) : (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-base font-semibold text-slate-900">{event.title}</div>
                    <Badge>ACTIVE</Badge>
                  </div>
                  <div className="text-slate-600">
                    <span className="font-medium text-slate-700">Window:</span> {fmtDT(event.startTime)} → {fmtDT(event.endTime)}
                  </div>
                </div>
              )}
            </div>

            {/* Token Actions */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Your Token</h2>
                  <p className="text-sm text-slate-600">
                    Generate only once per active event.
                  </p>
                </div>

                {!tokenData ? (
                  <button
                    onClick={generateToken}
                    disabled={actionLoading || !event}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                      actionLoading || !event ? "bg-slate-400 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800"
                    }`}
                  >
                    {actionLoading ? "Generating..." : "Generate Token"}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyTokenId}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                    >
                      Copy Token ID
                    </button>
                  </div>
                )}
              </div>

              {!tokenData ? (
                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  No token generated yet.
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-slate-900">Token Info</div>
                      <Badge type={statusBadge.type}>{statusBadge.label}</Badge>
                    </div>

                    <div className="mt-3 space-y-2 text-sm">
                      <div className="text-slate-600">
                        <span className="font-medium text-slate-700">Token ID:</span>{" "}
                        <span className="font-mono">{tokenData.tokenId}</span>
                      </div>
                      <div className="text-slate-600">
                        <span className="font-medium text-slate-700">Slot:</span>{" "}
                        {fmtTime(tokenData.slot?.startTime)} → {fmtTime(tokenData.slot?.endTime)}
                      </div>
                      <div className="text-slate-600">
                        <span className="font-medium text-slate-700">Generated:</span>{" "}
                        {fmtDT(tokenData.generatedAt)}
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-slate-500">
                      Tip: Keep brightness high for fast scanning.
                    </div>
                  </div>

                  {/* Gate Pass (QR) */}
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="text-sm font-semibold text-slate-900">Gate Pass QR</div>
                    <div className="mt-3 flex flex-col items-center justify-center gap-3">
                      <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <QRCodeCanvas value={qrValue || String(tokenData.tokenId)} size={190} />
                      </div>

                      <div className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                        <div className="font-semibold text-slate-900 mb-1">Student</div>
                        <div>Name: <span className="font-medium">{user?.name || "—"}</span></div>
                        <div>Reg No: <span className="font-medium">{user?.registerNumber || user?.regNo || "—"}</span></div>
                        <div>Degree/Sem: <span className="font-medium">{user?.degree || "—"} / {user?.semester || "—"}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column (sticky summary) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Quick Summary</h3>
              <div className="mt-3 space-y-3 text-sm text-slate-700">
                <div>
                  <div className="text-slate-500">Event</div>
                  <div className="font-semibold">{event?.title || "—"}</div>
                </div>
                <div>
                  <div className="text-slate-500">Event Window</div>
                  <div className="font-semibold">{event ? `${fmtTime(event.startTime)} → ${fmtTime(event.endTime)}` : "—"}</div>
                </div>
                <div>
                  <div className="text-slate-500">Token Status</div>
                  <div className="mt-1">
                    <Badge type={statusBadge.type}>{statusBadge.label}</Badge>
                  </div>
                </div>
                <div className="pt-2 text-xs text-slate-500">
                  If the scanner can’t read the QR, use “Copy Token ID” and show it to the admin.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;