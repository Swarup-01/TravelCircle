import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const linkStyle = (path) => ({
    color: "white",
    textDecoration: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    backgroundColor:
      location.pathname === path ? "rgba(255,255,255,0.2)" : "transparent",
  });

  return (
    <div
      style={{
        padding: "15px 40px",
        background: "linear-gradient(90deg, #3b82f6, #6366f1)",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <div>
        <h3 style={{ margin: 0 }}>TravelCircle ✈️</h3>

        {userName && (
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              opacity: 0.9,
            }}
          >
            🌍 Hey Swarup, where are we travelling today?
          </p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link to="/" style={linkStyle("/")}>
          Public Feed
        </Link>

        {token && (
          <Link to="/dashboard" style={linkStyle("/dashboard")}>
            Dashboard
          </Link>
        )}

        {!token ? (
          <>
            <Link to="/login" style={linkStyle("/login")}>
              Login
            </Link>
            <Link to="/register" style={linkStyle("/register")}>
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              background: "white",
              color: "#3b82f6",
              border: "none",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "0.3s ease",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
