import { useEffect, useMemo, useState } from "react";
import API from "../../api/api";
import { Html5QrcodeScanner } from "html5-qrcode";
import Button from "../../components/Button";
import Input from "../../components/Input";

function extractTokenId(scannedText) {
  let t = (scannedText || "").trim();
  if (!t) return "";

  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    t = t.slice(1, -1).trim();
  }

  if (t.startsWith("{") && t.endsWith("}")) {
    try {
      const obj = JSON.parse(t);
      const id = obj?.tokenId || obj?.data?.tokenId;
      return id ? String(id).trim() : "";
    } catch {
      return "";
    }
  }

  return t;
}

function fmtDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

const ScanEntry = () => {
  const [lastScan, setLastScan] = useState("");
  const [manual, setManual] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const tokenId = useMemo(
    () => extractTokenId(lastScan) || manual.trim(),
    [lastScan, manual]
  );

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
      {
        fps: 10,
        qrbox: { width: 220, height: 220 },
        rememberLastUsedCamera: true,
      },
      false
    );

    scanner.render(
      (decodedText) => {
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

  const clearState = () => {
    setError("");
    setResult(null);
    setManual("");
    setLastScan("");
  };

  const student = result?.data?.student;
  const ok = result?.success;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 md:text-3xl">
          Scan Entry
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Scan the student QR or verify manually using token ID.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Scanner */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Camera Scanner
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hold the QR code steady inside the scanner frame.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-950">
            <div id="qr-reader" className="min-h-[260px] rounded-lg" />
          </div>

          <div className="mt-5 border-t border-gray-200 pt-5 dark:border-gray-800">
            <div className="mb-3">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Manual Token ID
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use this if the QR code cannot be scanned.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <Input
                  value={manual}
                  onChange={(e) => setManual(e.target.value)}
                  placeholder="Enter token ID"
                />
              </div>

              <Button
                type="button"
                onClick={() => verify(manual)}
                disabled={loading || !manual.trim()}
                fullWidth={false}
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </div>

            {tokenId && (
              <div className="mt-3 break-all rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
                Current tokenId: <span className="font-mono">{tokenId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Result */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Result
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Verification result appears here.
              </p>
            </div>

            <Button
              type="button"
              onClick={clearState}
              variant="secondary"
              fullWidth={false}
            >
              Clear
            </Button>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              <div className="font-semibold">❌ Verification Failed</div>
              <div className="mt-1 text-sm">{error}</div>
            </div>
          )}

          {result && (
            <div
              className={`rounded-xl border p-4 ${
                ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
              }`}
            >
              <div className="text-lg font-bold">
                {ok ? "✅ Entry Allowed" : "⚠️ Entry Blocked"}
              </div>
              <div className="mt-1 text-sm">{result.message}</div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
                <div className="rounded-lg border border-white/40 bg-white/40 p-3 dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs uppercase tracking-wide opacity-70">
                    Token
                  </div>
                  <div className="mt-1 break-all font-mono">
                    {result?.data?.tokenId || "—"}
                  </div>
                </div>

                <div className="rounded-lg border border-white/40 bg-white/40 p-3 dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs uppercase tracking-wide opacity-70">
                    Time
                  </div>
                  <div className="mt-1 font-medium">
                    {fmtDateTime(result?.data?.entryTime)}
                  </div>
                </div>

                <div className="sm:col-span-2 rounded-lg border border-white/40 bg-white/40 p-3 dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs uppercase tracking-wide opacity-70">
                    Event
                  </div>
                  <div className="mt-1 font-medium">
                    {result?.data?.event?.title || "—"}
                  </div>
                </div>
              </div>

              {student && (
                <div className="mt-5 border-t border-current/15 pt-4 text-sm">
                  <div className="mb-3 text-base font-semibold">
                    Student Details
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-white/40 bg-white/40 p-3 dark:border-white/10 dark:bg-white/5">
                      <div className="text-xs uppercase tracking-wide opacity-70">
                        Name
                      </div>
                      <div className="mt-1 font-semibold">
                        {student.name || "—"}
                      </div>
                    </div>

                    <div className="rounded-lg border border-white/40 bg-white/40 p-3 dark:border-white/10 dark:bg-white/5">
                      <div className="text-xs uppercase tracking-wide opacity-70">
                        Register Number
                      </div>
                      <div className="mt-1 font-semibold">
                        {student.registerNumber || "—"}
                      </div>
                    </div>

                    <div className="rounded-lg border border-white/40 bg-white/40 p-3 dark:border-white/10 dark:bg-white/5">
                      <div className="text-xs uppercase tracking-wide opacity-70">
                        Degree
                      </div>
                      <div className="mt-1 font-semibold">
                        {student.degree || "—"}
                      </div>
                    </div>

                    <div className="rounded-lg border border-white/40 bg-white/40 p-3 dark:border-white/10 dark:bg-white/5">
                      <div className="text-xs uppercase tracking-wide opacity-70">
                        Semester
                      </div>
                      <div className="mt-1 font-semibold">
                        {student.semester || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!error && !result && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-400">
              Scan a QR code or enter a token ID manually to verify entry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanEntry;