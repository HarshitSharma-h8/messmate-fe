import { useState } from "react";
import API from "../../api/api";

const CreateEvent = () => {

  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [slots, setSlots] = useState([
    { degree: "", semester: "", startTime: "", endTime: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Slot input change handler
  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...slots];
    updatedSlots[index][field] = value;
    setSlots(updatedSlots);
  };

  // Add new slot
  const addSlot = () => {
    setSlots([
      ...slots,
      { degree: "", semester: "", startTime: "", endTime: "" },
    ]);
  };

  // Remove slot
  const removeSlot = (index) => {
    const updatedSlots = slots.filter((_, i) => i !== index);
    setSlots(updatedSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        title,
        startTime,
        endTime,
        slots,
      };

      await API.post("/events/create", payload);

      setSuccess("Event created successfully");

      // Reset form
      setTitle("");
      setStartTime("");
      setEndTime("");
      setSlots([{ degree: "", semester: "", startTime: "", endTime: "" }]);

    } catch (err) {

      const message =
        err.response?.data?.message || "Event creation failed";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-4">
        Create Event
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow"
      >

        {error && (
          <p className="text-red-500 mb-2">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 mb-2">
            {success}
          </p>
        )}

        {/* Event Info */}

        <div className="mb-3">
          <label className="block mb-1">Event Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">

          <div>
            <label className="block mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

        </div>

        {/* Slots Section */}

        <h3 className="font-semibold mb-2">
          Slots
        </h3>

        {slots.map((slot, index) => (

          <div
            key={index}
            className="border p-3 rounded mb-3"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

              <input
                placeholder="Degree"
                value={slot.degree}
                onChange={(e) =>
                  handleSlotChange(index, "degree", e.target.value)
                }
                className="border p-2 rounded"
                required
              />

              <input
                placeholder="Semester (optional)"
                value={slot.semester}
                onChange={(e) =>
                  handleSlotChange(index, "semester", e.target.value)
                }
                className="border p-2 rounded"
              />

              <input
                type="datetime-local"
                value={slot.startTime}
                onChange={(e) =>
                  handleSlotChange(index, "startTime", e.target.value)
                }
                className="border p-2 rounded"
                required
              />

              <input
                type="datetime-local"
                value={slot.endTime}
                onChange={(e) =>
                  handleSlotChange(index, "endTime", e.target.value)
                }
                className="border p-2 rounded"
                required
              />

            </div>

            {slots.length > 1 && (
              <button
                type="button"
                onClick={() => removeSlot(index)}
                className="text-red-500 mt-2"
              >
                Remove Slot
              </button>
            )}

          </div>

        ))}

        <button
          type="button"
          onClick={addSlot}
          className="bg-gray-700 text-white px-3 py-1 rounded mb-4"
        >
          Add Slot
        </button>

        <button
          type="submit"
          disabled={loading}
          className="block w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>

      </form>

    </div>
  );
};

export default CreateEvent;
