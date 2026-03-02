import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import theme from "../theme";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [itineraryData, setItineraryData] = useState({});
  const [editingItinerary, setEditingItinerary] = useState({});
  const [itineraryExpenseData, setItineraryExpenseData] = useState({});
  const navigate = useNavigate();

  const fetchTrips = useCallback(async () => {
    try {
      const res = await API.get("/trips/my");
      setTrips(res.data);
    } catch (error) {
      alert("Please login again");
      navigate("/login");
    }
  }, [navigate]);
  
  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

 

  const handleTogglePublic = async (tripId) => {
    try {
      await API.put(`/trips/${tripId}/toggle-public`);
      fetchTrips();
    } catch (error) {
      alert("Failed to update visibility ❌");
    }
  };

  
  const chartData = {
    labels: trips.map((trip) => trip.title),
    datasets: [
      {
        label: "Total Spent (₹)",
        data: trips.map((trip) => trip.totalSpent),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const handleItineraryChange = (tripId, field, value) => {
    setItineraryData({
      ...itineraryData,
      [tripId]: {
        ...itineraryData[tripId],
        [field]: value,
      },
    });
  };

  const handleAddItinerary = async (tripId) => {
    try {
      await API.post(`/trips/${tripId}/itinerary`, {
        day: Number(itineraryData[tripId]?.day),
        title: itineraryData[tripId]?.title,
        description: itineraryData[tripId]?.description,
        date: itineraryData[tripId]?.date,
        transport: itineraryData[tripId]?.transport,
        stayDuration: itineraryData[tripId]?.stayDuration,
      });

      setItineraryData({
        ...itineraryData,
        [tripId]: {},
      });

      fetchTrips();
    } catch (error) {
      alert("Failed to add itinerary ❌");
    }
  };

  const handleDeleteItinerary = async (tripId, itineraryId) => {
    try {
      await API.delete(`/trips/${tripId}/itinerary/${itineraryId}`);
      fetchTrips();
    } catch (error) {
      alert("Failed to delete itinerary ❌");
    }
  };

  const handleEditClick = (tripId, item) => {
    setEditingItinerary({
      ...editingItinerary,
      [item._id]: { ...item },
    });
  };

  const handleUpdateItinerary = async (tripId, itineraryId) => {
    try {
      await API.put(`/trips/${tripId}/itinerary/${itineraryId}`, {
        ...editingItinerary[itineraryId],
      });

      setEditingItinerary({
        ...editingItinerary,
        [itineraryId]: null,
      });

      fetchTrips();
    } catch (error) {
      alert("Failed to update itinerary ❌");
    }
  };

  const handleItineraryExpenseChange = (itineraryId, field, value) => {
    setItineraryExpenseData({
      ...itineraryExpenseData,
      [itineraryId]: {
        ...itineraryExpenseData[itineraryId],
        [field]: value,
      },
    });
  };

  const handleAddItineraryExpense = async (tripId, itineraryId) => {
    try {
      await API.post(`/trips/${tripId}/itinerary/${itineraryId}/expense`, {
        title: itineraryExpenseData[itineraryId]?.title,
        amount: Number(itineraryExpenseData[itineraryId]?.amount),
        category: itineraryExpenseData[itineraryId]?.category,
      });

      setItineraryExpenseData({
        ...itineraryExpenseData,
        [itineraryId]: {},
      });

      fetchTrips();
    } catch (error) {
      alert("Failed to add itinerary expense ❌");
    }
  };

  const handleDeleteItineraryExpense = async (
    tripId,
    itineraryId,
    expenseId,
  ) => {
    try {
      await API.delete(
        `/trips/${tripId}/itinerary/${itineraryId}/expense/${expenseId}`,
      );
      fetchTrips();
    } catch (error) {
      alert("Failed to delete expense ❌");
    }
  };

  const handleDeleteTrip = async (tripId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trip? This cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/trips/${tripId}`);
      fetchTrips();
    } catch (error) {
      alert("Failed to delete trip ❌");
    }
  };

  const modernInput = {
    width: "100%",
    padding: "10px 14px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "white",
    transition: "all 0.2s ease",
  };

  const modernExpenseInput = {
    width: "260px",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
    transition: "all 0.2s ease",
  };

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: theme.colors.background,
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
        My Dashboard
      </h2>

      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <button
          onClick={() => navigate("/create-trip")}
          style={{
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          + Create Trip
        </button>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: theme.colors.danger,
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          Logout
        </button>
      </div>

      <hr />

      <div
        style={{
          backgroundColor: theme.colors.card,
          padding: "20px",
          marginBottom: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h3>Budget Analytics 📊</h3>
        <Bar data={chartData} />
      </div>

      <hr />

      {trips.length === 0 ? (
        <p>No trips yet.</p>
      ) : (
        trips.map((trip) => (
          <motion.div
            key={trip._id}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: theme.colors.card,
              padding: "25px",
              marginBottom: "25px",
              borderRadius: "14px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0 }}>{trip.title}</h3>

              <span
                style={{
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  backgroundColor: trip.isPublic ? "#dcfce7" : "#fee2e2",
                  color: trip.isPublic ? "#166534" : "#991b1b",
                }}
              >
                {trip.isPublic ? "Public 🌍" : "Private 🔒"}
              </span>
            </div>

            <p style={{ marginTop: "10px", color: "#555" }}>
              Destination: <strong>{trip.destination}</strong>
            </p>

            <p>
              <strong>Duration:</strong> {trip.duration} days
            </p>

            <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
              <p>
                Total Spent: <strong>₹{trip.totalSpent}</strong>
              </p>
              <p>
                Remaining: <strong>₹{trip.remainingBudget}</strong>
              </p>
            </div>

            {/* ITINERARY TIMELINE */}
            {trip.itinerary && trip.itinerary.length > 0 && (
              <div style={{ marginTop: "25px", marginBottom: "25px" }}>
                <h4 style={{ marginBottom: "15px" }}>Trip Itinerary</h4>

                <div style={{ position: "relative", paddingLeft: "20px" }}>
                  {/* Vertical Line */}
                  <div
                    style={{
                      position: "absolute",
                      left: "8px",
                      top: 0,
                      bottom: 0,
                      width: "3px",
                      background: "#3b82f6",
                      borderRadius: "2px",
                    }}
                  />

                  {trip.itinerary
                    .sort((a, b) => a.day - b.day)
                    .map((item, index) => (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                          marginBottom: "20px",
                          paddingLeft: "20px",
                        }}
                      >
                        {/* Circle */}
                        <div
                          style={{
                            position: "absolute",
                            left: "-4px",
                            top: "5px",
                            width: "12px",
                            height: "12px",
                            background: "#3b82f6",
                            borderRadius: "50%",
                          }}
                        />

                        {editingItinerary[item._id] ? (
                          <div
                            style={{
                              background: "#f8fafc",
                              padding: "12px",
                              borderRadius: "10px",
                            }}
                          >
                            <input
                              type="number"
                              value={editingItinerary[item._id].day}
                              onChange={(e) =>
                                setEditingItinerary({
                                  ...editingItinerary,
                                  [item._id]: {
                                    ...editingItinerary[item._id],
                                    day: e.target.value,
                                  },
                                })
                              }
                              style={{ width: "100%", marginBottom: "6px" }}
                            />

                            <input
                              value={editingItinerary[item._id].title}
                              onChange={(e) =>
                                setEditingItinerary({
                                  ...editingItinerary,
                                  [item._id]: {
                                    ...editingItinerary[item._id],
                                    title: e.target.value,
                                  },
                                })
                              }
                              style={{ width: "100%", marginBottom: "6px" }}
                            />

                            <textarea
                              value={editingItinerary[item._id].description}
                              onChange={(e) =>
                                setEditingItinerary({
                                  ...editingItinerary,
                                  [item._id]: {
                                    ...editingItinerary[item._id],
                                    description: e.target.value,
                                  },
                                })
                              }
                              style={{ width: "100%", marginBottom: "6px" }}
                            />

                            <input
                              type="date"
                              value={
                                editingItinerary[item._id].date?.split("T")[0]
                              }
                              onChange={(e) =>
                                setEditingItinerary({
                                  ...editingItinerary,
                                  [item._id]: {
                                    ...editingItinerary[item._id],
                                    date: e.target.value,
                                  },
                                })
                              }
                              style={{ width: "100%", marginBottom: "6px" }}
                            />

                            <input
                              value={editingItinerary[item._id].transport}
                              onChange={(e) =>
                                setEditingItinerary({
                                  ...editingItinerary,
                                  [item._id]: {
                                    ...editingItinerary[item._id],
                                    transport: e.target.value,
                                  },
                                })
                              }
                              style={{ width: "100%", marginBottom: "6px" }}
                            />

                            <input
                              value={editingItinerary[item._id].stayDuration}
                              onChange={(e) =>
                                setEditingItinerary({
                                  ...editingItinerary,
                                  [item._id]: {
                                    ...editingItinerary[item._id],
                                    stayDuration: e.target.value,
                                  },
                                })
                              }
                              style={{ width: "100%", marginBottom: "10px" }}
                            />

                            <button
                              onClick={() =>
                                handleUpdateItinerary(trip._id, item._id)
                              }
                              style={{
                                background: "#22c55e",
                                color: "white",
                                border: "none",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                marginRight: "8px",
                              }}
                            >
                              Save
                            </button>

                            <button
                              onClick={() =>
                                setEditingItinerary({
                                  ...editingItinerary,
                                  [item._id]: null,
                                })
                              }
                              style={{
                                background: "#ef4444",
                                color: "white",
                                border: "none",
                                padding: "6px 10px",
                                borderRadius: "6px",
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              background: "#f8fafc",
                              padding: "12px",
                              borderRadius: "10px",
                              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                            }}
                          >
                            <strong>
                              Day {item.day} – {item.title}
                            </strong>

                            <p style={{ fontSize: "14px", margin: "6px 0" }}>
                              {item.description}
                            </p>

                            <div style={{ fontSize: "12px", color: "#555" }}>
                              📅 {new Date(item.date).toLocaleDateString()} | 🚆{" "}
                              {item.transport} | ⏱ {item.stayDuration}
                            </div>

                            {/* Expenses for this day */}
                            {item.expenses && item.expenses.length > 0 && (
                              <div style={{ marginTop: "10px" }}>
                                <strong>Expenses:</strong>

                                {item.expenses.map((expense) => (
                                  <div
                                    key={expense._id}
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      background: "#f1f5f9",
                                      padding: "6px 10px",
                                      borderRadius: "6px",
                                      marginTop: "6px",
                                      fontSize: "13px",
                                    }}
                                  >
                                    <span>
                                      {expense.title} ({expense.category})
                                    </span>

                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                      }}
                                    >
                                      <span>₹{expense.amount}</span>

                                      <button
                                        onClick={() =>
                                          handleDeleteItineraryExpense(
                                            trip._id,
                                            item._id,
                                            expense._id,
                                          )
                                        }
                                        style={{
                                          background: "#ef4444",
                                          color: "white",
                                          border: "none",
                                          padding: "3px 8px",
                                          borderRadius: "6px",
                                          fontSize: "11px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add Expense Form */}
                            <div style={{ marginTop: "15px" }}>
                              <input
                                placeholder="Expense Title"
                                style={modernExpenseInput}
                                onFocus={(e) => {
                                  e.target.style.border = "1px solid #3b82f6";
                                  e.target.style.boxShadow =
                                    "0 0 0 3px rgba(59,130,246,0.15)";
                                }}
                                onBlur={(e) => {
                                  e.target.style.border = "1px solid #e2e8f0";
                                  e.target.style.boxShadow =
                                    "0 2px 6px rgba(0,0,0,0.04)";
                                }}
                                value={
                                  itineraryExpenseData[item._id]?.title || ""
                                }
                                onChange={(e) =>
                                  handleItineraryExpenseChange(
                                    item._id,
                                    "title",
                                    e.target.value,
                                  )
                                }
                              />

                              <input
                                type="number"
                                placeholder="Amount"
                                style={modernExpenseInput}
                                onFocus={(e) => {
                                  e.target.style.border = "1px solid #3b82f6";
                                  e.target.style.boxShadow =
                                    "0 0 0 3px rgba(59,130,246,0.15)";
                                }}
                                onBlur={(e) => {
                                  e.target.style.border = "1px solid #e2e8f0";
                                  e.target.style.boxShadow =
                                    "0 2px 6px rgba(0,0,0,0.04)";
                                }}
                                value={
                                  itineraryExpenseData[item._id]?.amount || ""
                                }
                                onChange={(e) =>
                                  handleItineraryExpenseChange(
                                    item._id,
                                    "amount",
                                    e.target.value,
                                  )
                                }
                              />

                              <input
                                placeholder="Category"
                                style={modernExpenseInput}
                                onFocus={(e) => {
                                  e.target.style.border = "1px solid #3b82f6";
                                  e.target.style.boxShadow =
                                    "0 0 0 3px rgba(59,130,246,0.15)";
                                }}
                                onBlur={(e) => {
                                  e.target.style.border = "1px solid #e2e8f0";
                                  e.target.style.boxShadow =
                                    "0 2px 6px rgba(0,0,0,0.04)";
                                }}
                                value={
                                  itineraryExpenseData[item._id]?.category || ""
                                }
                                onChange={(e) =>
                                  handleItineraryExpenseChange(
                                    item._id,
                                    "category",
                                    e.target.value,
                                  )
                                }
                               
                              />

                              <button
                                onClick={() =>
                                  handleAddItineraryExpense(trip._id, item._id)
                                }
                                style={{
                                  background: "#3b82f6",
                                  color: "white",
                                  border: "none",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                }}
                              >
                                Add Expense
                              </button>
                            </div>

                            <div style={{ marginTop: "8px" }}>
                              <button
                                onClick={() => handleEditClick(trip._id, item)}
                                style={{
                                  background: "#3b82f6",
                                  color: "white",
                                  border: "none",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  marginRight: "8px",
                                  fontSize: "12px",
                                }}
                              >
                                Edit Itinerary
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteItinerary(trip._id, item._id)
                                }
                                style={{
                                  background: "#ef4444",
                                  color: "white",
                                  border: "none",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                }}
                              >
                                Delete Itinerary
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            <h4>Add Itinerary</h4>

            <div
              style={{
                background: "#f8fafc",
                padding: "24px",
                borderRadius: "16px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                marginTop: "25px",
                width: "100%",
                maxWidth: "900px",
                margin: "25px auto",
              }}
            >
              <h4 style={{ marginBottom: "18px" }}>Add Itinerary</h4>

              <input
                type="number"
                placeholder="Day"
                value={itineraryData[trip._id]?.day || ""}
                onChange={(e) =>
                  handleItineraryChange(trip._id, "day", e.target.value)
                }
                style={modernInput}
              />

              <input
                placeholder="Title"
                value={itineraryData[trip._id]?.title || ""}
                onChange={(e) =>
                  handleItineraryChange(trip._id, "title", e.target.value)
                }
                style={modernInput}
              />

              <textarea
                placeholder="Description"
                value={itineraryData[trip._id]?.description || ""}
                onChange={(e) =>
                  handleItineraryChange(trip._id, "description", e.target.value)
                }
                style={{ ...modernInput, height: "90px", resize: "none" }}
              />

              <input
                type="date"
                value={itineraryData[trip._id]?.date || ""}
                onChange={(e) =>
                  handleItineraryChange(trip._id, "date", e.target.value)
                }
                style={modernInput}
              />

              <input
                placeholder="Transport (Flight/Train/Bus)"
                value={itineraryData[trip._id]?.transport || ""}
                onChange={(e) =>
                  handleItineraryChange(trip._id, "transport", e.target.value)
                }
                style={modernInput}
              />

              <input
                placeholder="Stay Duration (e.g. 3 hours)"
                value={itineraryData[trip._id]?.stayDuration || ""}
                onChange={(e) =>
                  handleItineraryChange(
                    trip._id,
                    "stayDuration",
                    e.target.value,
                  )
                }
                style={modernInput}
              />

              <button
                onClick={() => handleAddItinerary(trip._id)}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  color: "white",
                  border: "none",
                  padding: "12px",
                  borderRadius: "10px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "0.2s ease",
                }}
                onMouseOver={(e) => (e.target.style.opacity = "0.9")}
                onMouseOut={(e) => (e.target.style.opacity = "1")}
              >
                Add Itinerary
              </button>
            </div>

            <div
              style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
            ></div>

            <button
              onClick={() => handleTogglePublic(trip._id)}
              style={{
                backgroundColor: trip.isPublic
                  ? "#ef4444"
                  : theme.colors.success,
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                marginBottom: "20px",
                transition: "0.2s ease",
              }}
            >
              {trip.isPublic ? "Make Private" : "Make Public"}
            </button>

            <button
              onClick={() => handleDeleteTrip(trip._id)}
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Delete Trip
            </button>
          </motion.div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
