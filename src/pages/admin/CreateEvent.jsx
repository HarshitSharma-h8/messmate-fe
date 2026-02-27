import { useMemo, useState } from "react";
import API from "../../api/api";

const DEGREE_OPTIONS = [
  "BTECH",
  "MTECH",
  "MBA",
  "BCA",
  "MCA",
  "BSC",
  "MSC",
  "OTHER",
];

const emptySlot = () => ({
  degree: "",
  semester: "", // optional
  startTime: "",
  endTime: "",
});

function toDate(x) {
  const d = x ? new Date(x) : null;
  return d && !isNaN(d.getTime()) ? d : null;
}

function fmtRange(a, b) {
  const da = toDate(a);
  const db = toDate(b);
  if (!da || !db) return "";
  return `${da.toLocaleString()} → ${db.toLocaleString()}`;
}

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(""); // datetime-local string
  const [endTime, setEndTime] = useState("");
  const [slots, setSlots] = useState([emptySlot()]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const eventErrors = useMemo(() => {
    const errs = [];
    const s = toDate(startTime);
    const e = toDate(endTime);
    if (startTime && endTime && s && e && e <= s) {
      errs.push("Event end time must be after start time.");
    }
    if (!title.trim()) errs.push("Event title is required.");
    if (!startTime) errs.push("Event start time is required.");
    if (!endTime) errs.push("Event end time is required.");
    return errs;
  }, [title, startTime, endTime]);

  const slotErrors = useMemo(() => {
    const errs = [];
    const evS = toDate(startTime);
    const evE = toDate(endTime);

    slots.forEach((sl, idx) => {
      const s = toDate(sl.startTime);
      const e = toDate(sl.endTime);

      if (!sl.degree) errs.push(`Slot ${idx + 1}: degree is required.`);
      if (!sl.startTime) errs.push(`Slot ${idx + 1}: start time is required.`);
      if (!sl.endTime) errs.push(`Slot ${idx + 1}: end time is required.`);

      if (sl.startTime && sl.endTime && s && e && e <= s) {
        errs.push(`Slot ${idx + 1}: end time must be after start time.`);
      }

      // If event range provided, keep slot within it
      if (evS && s && s < evS) errs.push(`Slot ${idx + 1}: starts before event starts.`);
      if (evE && e && e > evE) errs.push(`Slot ${idx + 1}: ends after event ends.`);
    });

    return errs;
  }, [slots, startTime, endTime]);

  const canSubmit = eventErrors.length === 0 && slotErrors.length === 0 && !loading;

  const setSlot = (index, patch) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const addSlot = () => setSlots((prev) => [...prev, emptySlot()]);

  const duplicateSlot = (index) => {
    setSlots((prev) => {
      const copy = { ...prev[index] };
      return [...prev, copy];
    });
  };

  const removeSlot = (index) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle("");
    setStartTime("");
    setEndTime("");
    setSlots([emptySlot()]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // final guard
    if (!canSubmit) {
      setError("Please fix the form errors before creating the event.");
      return;
    }

    try {
      setLoading(true);

      // Backend expects: { title, startTime, endTime, slots }
      const payload = {
        title: title.trim(),
        startTime,
        endTime,
        slots: slots.map((s) => ({
          degree: s.degree,
          semester: (s.semester || "").trim(), // optional
          startTime: s.startTime,
          endTime: s.endTime,
        })),
      };

      await API.post("/events/create", payload);

      setSuccess("✅ Event created successfully");
      resetForm();
    } catch (err) {
      const message = err?.response?.data?.message || "Event creation failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Create Event</h1>
          <p className="text-slate-600 mt-1">
            Define event timing, then add degree/semester slots for token generation windows.
          </p>
        </div>

        {(error || success) && (
          <div
            className={`mb-6 rounded-lg border p-4 ${
              error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            <div className="font-medium">{error ? "There’s a problem" : "Success"}</div>
            <div className="mt-1 text-sm">{error || success}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: main form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Info */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Event Details</h2>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSuccess("");
                  }}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Clear messages
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Event title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    placeholder="e.g., Lunch Entry - Boys Mess"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Start time</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">End time</label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    required
                  />
                </div>

                {(eventErrors.length > 0) && (
                  <div className="md:col-span-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
                    <div className="text-sm font-medium">Fix these event issues:</div>
                    <ul className="mt-1 text-sm list-disc ml-5">
                      {eventErrors.map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Slots */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Slots</h2>
                  <p className="text-sm text-slate-600">
                    Each slot defines who can generate tokens and during which time window.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addSlot}
                  className="shrink-0 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  + Add slot
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {slots.map((slot, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-semibold text-slate-900">Slot {index + 1}</div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => duplicateSlot(index)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-100"
                        >
                          Duplicate
                        </button>
                        {slots.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSlot(index)}
                            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Degree</label>
                        <select
                          value={slot.degree}
                          onChange={(e) => setSlot(index, { degree: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                          required
                        >
                          <option value="">Select degree</option>
                          {DEGREE_OPTIONS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700">
                          Semester <span className="font-normal text-slate-500">(optional)</span>
                        </label>
                        <input
                          value={slot.semester}
                          onChange={(e) => setSlot(index, { semester: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                          placeholder="e.g., 6"
                        />
                        <p className="mt-1 text-xs text-slate-500">
                          Leave empty to allow all semesters for the selected degree.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700">Slot start</label>
                        <input
                          type="datetime-local"
                          value={slot.startTime}
                          onChange={(e) => setSlot(index, { startTime: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700">Slot end</label>
                        <input
                          type="datetime-local"
                          value={slot.endTime}
                          onChange={(e) => setSlot(index, { endTime: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                          required
                        />
                      </div>

                      <div className="md:col-span-2 text-xs text-slate-600">
                        <span className="font-medium">Preview:</span>{" "}
                        {slot.degree ? slot.degree : "—"}
                        {slot.semester ? ` / Sem ${slot.semester}` : ""}
                        {slot.startTime && slot.endTime ? ` • ${fmtRange(slot.startTime, slot.endTime)}` : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {slotErrors.length > 0 && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
                  <div className="text-sm font-medium">Fix these slot issues:</div>
                  <ul className="mt-1 text-sm list-disc ml-5">
                    {slotErrors.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={!canSubmit}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                  canSubmit ? "bg-slate-900 hover:bg-slate-800" : "bg-slate-400 cursor-not-allowed"
                }`}
              >
                {loading ? "Creating..." : "Create Event"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-60"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right: summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <div>
                  <div className="text-slate-500">Title</div>
                  <div className="font-medium">{title.trim() || "—"}</div>
                </div>
                <div>
                  <div className="text-slate-500">Event window</div>
                  <div className="font-medium">{startTime && endTime ? fmtRange(startTime, endTime) : "—"}</div>
                </div>
                <div>
                  <div className="text-slate-500">Slots</div>
                  <div className="font-medium">{slots.length}</div>
                </div>

                <div className="pt-2">
                  <div className="text-slate-500 mb-1">Slot list</div>
                  <div className="space-y-2">
                    {slots.map((s, i) => (
                      <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                        <div className="font-medium">
                          {i + 1}. {s.degree || "—"}
                          {s.semester ? ` / Sem ${s.semester}` : ""}
                        </div>
                        <div className="text-xs text-slate-600">
                          {s.startTime && s.endTime ? fmtRange(s.startTime, s.endTime) : "Time not set"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 text-xs text-slate-500">
                  Tip: Keep slot times within the event window to avoid confusion at the entry gate.
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;