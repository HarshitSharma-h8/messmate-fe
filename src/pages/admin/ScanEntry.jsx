import { useEffect, useMemo, useState } from "react";
import API from "../../api/api";
import { Html5QrcodeScanner } from "html5-qrcode";

function extractTokenId(scannedText) {
  let t = (scannedText || "").trim();
  if (!t) return "";

  // remove wrapping quotes if scanner returns them
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    t = t.slice(1, -1).trim();
  }

  // JSON QR: {"tokenId":"..."}
  if (t.startsWith("{") && t.endsWith("}")) {
    try {
      const obj = JSON.parse(t);
      const id = obj?.tokenId || obj?.data?.tokenId; // support nested too
      return id ? String(id).trim() : "";
    } catch {
      return "";
    }
  }

  return t; // raw tokenId
}

const ScanEntry = () => {
  const [lastScan, setLastScan] = useState("");
  const [manual, setManual] = useState("");
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null); // {success, message, data}
  const [error, setError] = useState("");

  const tokenId = useMemo(() => extractTokenId(lastScan) || manual.trim(), [lastScan, manual]);

  const verify = async (id) => {
    const finalId = String(id || "").trim();
    if (!finalId) return;

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await API.post("/tokens/verify", { tokenId: finalId });
      setResult(res.data);
    } catch (err) {
      setResult(null);
      setError(err?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250, rememberLastUsedCamera: true },
      false
    );

    scanner.render(
      (decodedText) => {
        // prevent repeated firing
        setLastScan(decodedText);
        const id = extractTokenId(decodedText);
        if (id) verify(id);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  const student = result?.data?.student;
  const ok = result?.success;

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-4">Scan Entry</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="font-semibold mb-2">Camera Scanner</div>
          <div id="qr-reader" className="rounded-lg overflow-hidden" />

          <div className="mt-4 border-t pt-4">
            <div className="font-semibold mb-2">Manual Token ID</div>
            <div className="flex gap-2">
              <input
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder="Enter tokenId"
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <button
                onClick={() => verify(manual)}
                disabled={loading || !manual.trim()}
                className={`px-4 py-2 rounded-lg font-semibold text-white ${
                  loading || !manual.trim() ? "bg-gray-400" : "bg-gray-900 hover:bg-gray-800"
                }`}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>

            {tokenId && (
              <div className="text-xs text-gray-500 mt-2">
                Current tokenId: <span className="font-mono">{tokenId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Result */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="font-semibold mb-2">Result</div>

          {error && (
            <div className="border border-red-200 bg-red-50 text-red-800 rounded-lg p-3">
              ❌ {error}
            </div>
          )}

          {result && (
            <div
              className={`rounded-lg p-3 border ${
                ok ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-amber-50 text-amber-900"
              }`}
            >
              <div className="font-bold">{ok ? "✅ Entry Allowed" : "⚠️ Entry Blocked"}</div>
              <div className="text-sm mt-1">{result.message}</div>

              <div className="mt-3 text-sm">
                <div>
                  Token: <span className="font-mono">{result?.data?.tokenId}</span>
                </div>
                <div>Time: {result?.data?.entryTime ? new Date(result.data.entryTime).toLocaleString() : "—"}</div>
                <div>Event: {result?.data?.event?.title || "—"}</div>
              </div>

              {student && (
                <div className="mt-4 border-t pt-3 text-sm">
                  <div className="font-semibold mb-2">Student Details</div>
                  <div>Name: <span className="font-semibold">{student.name || "—"}</span></div>
                  <div>Reg No: <span className="font-semibold">{student.registerNumber || "—"}</span></div>
                  <div>Degree: <span className="font-semibold">{student.degree || "—"}</span></div>
                  <div>Semester: <span className="font-semibold">{student.semester || "—"}</span></div>
                </div>
              )}
            </div>
          )}

          {!error && !result && (
            <div className="text-gray-600 text-sm">
              Scan a QR or enter tokenId manually to verify entry.
            </div>
          )}

          <button
            onClick={() => {
              setError("");
              setResult(null);
              setManual("");
              setLastScan("");
            }}
            className="mt-4 border rounded-lg px-3 py-2 text-sm font-semibold hover:bg-gray-100"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanEntry;