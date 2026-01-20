import { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../context/useAuth";

const StudentDashboard = () => {

  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch active event + my token
  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch active event
        const eventRes = await API.get("/events/active");
        setEvent(eventRes.data.data);

        // Fetch my token (if exists)
        try {
          const tokenRes = await API.get("/tokens/my");
          setTokenData(tokenRes.data.data);
        } catch {
          setTokenData(null); // No token yet
        }

      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []);

  const generateToken = async () => {
    try {
      setLoading(true);

      const res = await API.post("/tokens/generate");

      setTokenData(res.data.data);

    } catch (err) {
      alert(
        err.response?.data?.message || "Token generation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        {error}
      </p>
    );
  }

  return (
    <div className="p-4">

      <h2 className="text-xl font-bold mb-3">
        Welcome, {user.name}
      </h2>

      {/* Event Info */}
      <div className="bg-white shadow p-4 rounded mb-4">

        <h3 className="font-semibold">
          Event: {event.title}
        </h3>

        <p>
          Time:
          {" "}
          {new Date(event.startTime).toLocaleTimeString()} -
          {" "}
          {new Date(event.endTime).toLocaleTimeString()}
        </p>

      </div>

      {/* Token Section */}

      {!tokenData ? (

        <button
          onClick={generateToken}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Generate Token
        </button>

      ) : (

        <div className="bg-green-100 p-4 rounded">

          <h4 className="font-semibold mb-2">
            Your Token
          </h4>

          <p>
            Token ID:
            <span className="font-mono block">
              {tokenData.tokenId}
            </span>
          </p>

          <p className="mt-2">
            Slot:
            {" "}
            {new Date(tokenData.slot.startTime).toLocaleTimeString()}
            {" "} -
            {" "}
            {new Date(tokenData.slot.endTime).toLocaleTimeString()}
          </p>

          <p className="mt-1">
            Status: {tokenData.status}
          </p>

        </div>

      )}

    </div>
  );
};

export default StudentDashboard;
