import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CreateTrip() {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState("");
  const [duration, setDuration] = useState("");
  const navigate = useNavigate();

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    try {
      await API.post("/trips/create", {
        title,
        destination,
        estimatedBudget: Number(estimatedBudget),
        duration: Number(duration),
      });

      navigate("/dashboard");
    } catch (error) {
      alert("Failed to create trip ❌");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <form
        onSubmit={handleCreateTrip}
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "14px",
          width: "400px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginBottom: "25px", textAlign: "center" }}>
          Create New Trip ✈️
        </h2>

        <input
          type="text"
          placeholder="Trip Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            outline: "none",
          }}
        />

        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            outline: "none",
          }}
        />

        <input
          type="number"
          placeholder="Estimated Budget"
          value={estimatedBudget}
          onChange={(e) => setEstimatedBudget(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            outline: "none",
          }}
        />

        <input
          type="number"
          placeholder="Duration (in days)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            outline: "none",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "15px",
            transition: "0.3s ease",
          }}
        >
          Create Trip
        </button>
      </form>
    </div>
  );
}

export default CreateTrip;
