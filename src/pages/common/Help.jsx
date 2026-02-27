const Help = ({ role }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Help & How It Works</h1>

      {role === "ADMIN" && (
        <>
          <h2 className="text-lg font-semibold mt-4">For Admin</h2>
          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>Create an event before students can generate tokens.</li>
            <li>Add proper slot timings for degrees/semesters.</li>
            <li>Go to Scan Entry at the gate.</li>
            <li>Scan student QR or enter tokenId manually.</li>
            <li>Green = Entry allowed, Red = Entry blocked.</li>
            <li>Each token can only be used once.</li>
          </ul>
        </>
      )}

      {role === "STUDENT" && (
        <>
          <h2 className="text-lg font-semibold mt-4">For Students</h2>
          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>Login and go to Dashboard.</li>
            <li>Generate token when event is active.</li>
            <li>Show QR at the mess gate.</li>
            <li>After scanning, token becomes USED.</li>
            <li>One token per event only.</li>
          </ul>
        </>
      )}

      <div className="mt-6 border-t pt-4 text-sm text-gray-600">
        If you face issues, contact your mess administrator.
      </div>
    </div>
  );
};

export default Help;