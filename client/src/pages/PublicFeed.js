import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";

function PublicFeed() {
  const [searchTerm, setSearchTerm] = useState("");
  const [trips, setTrips] = useState([]);
  const [commentData, setCommentData] = useState({});
  const [prediction, setPrediction] = useState({});

  useEffect(() => {
    fetchPublicTrips();
  }, []);

  const fetchPublicTrips = async () => {
    try {
      const res = await API.get("/trips/public");
      setTrips(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async (tripId) => {
    try {
      await API.put(`/trips/${tripId}/like`);
      fetchPublicTrips();
    } catch {
      alert("Login required to like");
    }
  };

  const handleCommentChange = (tripId, value) => {
    setCommentData({
      ...commentData,
      [tripId]: value,
    });
  };

  const handleComment = async (tripId) => {
    try {
      await API.post(`/trips/${tripId}/comment`, {
        text: commentData[tripId],
      });
      fetchPublicTrips();
    } catch {
      alert("Login required to comment");
    }
  };

  const handlePrediction = async (destination) => {
    try {
      const res = await API.get(`/trips/prediction/${destination}`);
      setPrediction({
        ...prediction,
        [destination]: res.data.message,
      });
    } catch {
      alert("No data available");
    }
  };

  const filteredTrips = trips.filter((trip) =>
    trip.destination.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "20px",
          color: "#111827",
        }}
      >
        Public Trips
      </h2>

      <input
        type="text"
        placeholder="Search by destination..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          maxWidth: "400px",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      {trips.length === 0 ? (
        <p>No public trips yet.</p>
      ) : (
        filteredTrips.map((trip) => (
          <motion.div
            key={trip._id}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              marginBottom: "25px",
              borderRadius: "14px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>{trip.title}</h3>

            <p style={{ color: "#555" }}>
              Destination: <strong>{trip.destination}</strong>
            </p>

            <p>
              <strong>Duration:</strong> {trip.duration} days
            </p>

            <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
              <p>
                Total Spent: <strong>₹{trip.totalSpent}</strong>
              </p>
              <p>❤️ {trip.likes.length} Likes</p>
              <p>💬 {trip.comments.length} Comments</p>
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <button
                onClick={() => handleLike(trip._id)}
                style={{
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ❤️ Like
              </button>

              <button
                onClick={() => handlePrediction(trip.destination)}
                style={{
                  backgroundColor: "#22c55e",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                🔮 Predict Budget
              </button>
            </div>

            {prediction[trip.destination] && (
              <div
                style={{
                  backgroundColor: "#ecfdf5",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  color: "#065f46",
                  fontWeight: "500",
                }}
              >
                {prediction[trip.destination]}
              </div>
            )}

            <hr />

            <div style={{ marginTop: "10px" }}>
              <input
                placeholder="Write comment..."
                value={commentData[trip._id] || ""}
                onChange={(e) => handleCommentChange(trip._id, e.target.value)}
                style={{
                  padding: "10px",
                  width: "75%",
                  marginRight: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />

              <button
                onClick={() => handleComment(trip._id)}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Comment
              </button>
            </div>

            <div
              key={trip._id}
              style={{
                background: "#ffffff",
                padding: "25px",
                marginBottom: "25px",
                borderRadius: "14px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              }}
            >
              <h4 style={{ marginBottom: "10px" }}>Trip Itinerary</h4>

              {trip.itinerary
                ?.sort((a, b) => a.day - b.day)
                .map((item) => (
                  <div
                    key={item._id}
                    style={{
                      background: "#f8fafc",
                      padding: "12px",
                      borderRadius: "10px",
                      marginBottom: "12px",
                    }}
                  >
                    <strong>
                      Day {item.day} – {item.title}
                    </strong>

                    <p style={{ margin: "6px 0", fontSize: "14px" }}>
                      {item.description}
                    </p>

                    <p style={{ fontSize: "12px", color: "#555" }}>
                      📅 {new Date(item.date).toLocaleDateString()} | 🚆{" "}
                      {item.transport} | ⏱ {item.stayDuration}
                    </p>

                    {/* Expenses Per Day */}
                    {item.expenses && item.expenses.length > 0 && (
                      <div style={{ marginTop: "8px" }}>
                        <strong style={{ fontSize: "13px" }}>Expenses:</strong>

                        {item.expenses.map((expense) => (
                          <div
                            key={expense._id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "12px",
                              marginTop: "4px",
                            }}
                          >
                            <span>
                              {expense.title} ({expense.category})
                            </span>
                            <span>₹{expense.amount}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
            <div
              style={{
                textAlign: "right",
                marginTop: "15px",
                fontSize: "13px",
                color: "#555",
                fontStyle: "italic",
              }}
            >
              Created by {trip.user?.name}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

export default PublicFeed;
