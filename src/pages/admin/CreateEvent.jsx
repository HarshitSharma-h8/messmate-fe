import { useMemo, useState } from "react";
import API from "../../api/api";
import Button from "../../components/Button";

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
  semester: "",
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

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/40";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
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
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!canSubmit) {
      setError("Please fix the form errors before creating the event.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        startTime,
        endTime,
        slots: slots.map((s) => ({
          degree: s.degree,
          semester: (s.semester || "").trim(),
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
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 md:text-3xl">
          Create Event
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Define event timing, then add degree or semester slots for token generation.
        </p>
      </div>

      {(error || success) && (
        <div
          className={`mb-6 rounded-xl border p-4 ${
            error
              ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
              : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
          }`}
        >
          <div className="font-medium">{error ? "There’s a problem" : "Success"}</div>
          <div className="mt-1 text-sm">{error || success}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 xl:col-span-2">
          {/* Event Details */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Event Details
              </h2>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setSuccess("");
                }}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear messages
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Event title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                  placeholder="e.g., Lunch Entry - Boys Mess"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start time
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End time
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              {eventErrors.length > 0 && (
                <div className="md:col-span-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                  <div className="text-sm font-medium">Fix these event issues:</div>
                  <ul className="mt-1 ml-5 list-disc text-sm">
                    {eventErrors.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Slots */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Slots
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Each slot defines who can generate tokens and during which time window.
                </p>
              </div>

              <Button type="button" onClick={addSlot} fullWidth={false}>
                + Add Slot
              </Button>
            </div>

            <div className="mt-4 space-y-4">
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      Slot {index + 1}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        onClick={() => duplicateSlot(index)}
                        variant="secondary"
                        fullWidth={false}
                      >
                        Duplicate
                      </Button>

                      {slots.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeSlot(index)}
                          variant="danger"
                          fullWidth={false}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Degree
                      </label>
                      <select
                        value={slot.degree}
                        onChange={(e) => setSlot(index, { degree: e.target.value })}
                        className={inputClass}
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Semester <span className="font-normal text-gray-500 dark:text-gray-400">(optional)</span>
                      </label>
                      <input
                        value={slot.semester}
                        onChange={(e) => setSlot(index, { semester: e.target.value })}
                        className={inputClass}
                        placeholder="e.g., 6"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Leave empty to allow all semesters for the selected degree.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Slot start
                      </label>
                      <input
                        type="datetime-local"
                        value={slot.startTime}
                        onChange={(e) => setSlot(index, { startTime: e.target.value })}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Slot end
                      </label>
                      <input
                        type="datetime-local"
                        value={slot.endTime}
                        onChange={(e) => setSlot(index, { endTime: e.target.value })}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div className="md:col-span-2 text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Preview:</span>{" "}
                      {slot.degree || "—"}
                      {slot.semester ? ` / Sem ${slot.semester}` : ""}
                      {slot.startTime && slot.endTime ? ` • ${fmtRange(slot.startTime, slot.endTime)}` : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {slotErrors.length > 0 && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                <div className="text-sm font-medium">Fix these slot issues:</div>
                <ul className="mt-1 ml-5 list-disc text-sm">
                  {slotErrors.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button type="submit" disabled={!canSubmit} fullWidth={false}>
              {loading ? "Creating..." : "Create Event"}
            </Button>

            <Button
              type="button"
              onClick={resetForm}
              disabled={loading}
              variant="secondary"
              fullWidth={false}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Right */}
        <div className="xl:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm xl:sticky xl:top-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Summary
            </h3>

            <div className="mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <div className="text-gray-500 dark:text-gray-400">Title</div>
                <div className="font-medium">{title.trim() || "—"}</div>
              </div>

              <div>
                <div className="text-gray-500 dark:text-gray-400">Event window</div>
                <div className="font-medium">
                  {startTime && endTime ? fmtRange(startTime, endTime) : "—"}
                </div>
              </div>

              <div>
                <div className="text-gray-500 dark:text-gray-400">Slots</div>
                <div className="font-medium">{slots.length}</div>
              </div>

              <div className="pt-2">
                <div className="mb-1 text-gray-500 dark:text-gray-400">Slot list</div>
                <div className="space-y-2">
                  {slots.map((s, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-950"
                    >
                      <div className="font-medium">
                        {i + 1}. {s.degree || "—"}
                        {s.semester ? ` / Sem ${s.semester}` : ""}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {s.startTime && s.endTime ? fmtRange(s.startTime, s.endTime) : "Time not set"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 text-xs text-gray-500 dark:text-gray-400">
                Tip: Keep slot times within the event window to avoid confusion at the entry gate.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;