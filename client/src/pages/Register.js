import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { name, email, password });
      alert("Registration successful ✅");
      navigate("/login");
    } catch (error) {
      alert("Registration failed ❌");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* LEFT SIDE */}
      <div
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #6366f1, #3b82f6)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <h1 style={{ fontSize: "42px", marginBottom: "20px" }}>
          Join TravelCircle 🌍
        </h1>
        <p style={{ maxWidth: "300px", textAlign: "center", opacity: 0.9 }}>
          Create your account and start tracking your travel adventures today.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#f1f5f9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form
          onSubmit={handleRegister}
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "14px",
            width: "350px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
            Create Account ✨
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
              background: "linear-gradient(135deg, #6366f1, #3b82f6)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Register
          </button>

          <p style={{ marginTop: "15px", textAlign: "center" }}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{
                color: "#3b82f6",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
