import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.name);
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed ❌");
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
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <h1 style={{ fontSize: "42px", marginBottom: "20px" }}>
          Start Your Journey ✈️
        </h1>
        <p style={{ maxWidth: "300px", textAlign: "center", opacity: 0.9 }}>
          Plan trips, track expenses, and explore public adventures with
          TravelCircle.
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
          onSubmit={handleLogin}
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "14px",
            width: "350px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
            Welcome Back 👋
          </h2>

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
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Login
          </button>

          <p style={{ marginTop: "15px", textAlign: "center" }}>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{
                color: "#3b82f6",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
