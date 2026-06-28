// frontend/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/chat", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>💬 ChatSphere</h1>
          <p style={styles.subtitle}>Welcome back! Login to continue.</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading && styles.buttonLoading)
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={styles.footer}>
            Don't have an account? <Link to="/register" style={styles.link}>Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#0f172a",
    padding: "20px"
  },
  card: {
    background: "#1e293b",
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
  },
  header: {
    textAlign: "center",
    marginBottom: "30px"
  },
  title: {
    color: "#ffffff",
    fontSize: "28px",
    marginBottom: "8px"
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "14px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  label: {
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: "500"
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#ffffff",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s"
  },
  button: {
    padding: "14px",
    background: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  buttonLoading: {
    opacity: 0.7,
    cursor: "not-allowed"
  },
  error: {
    background: "#7f1d1d",
    color: "#fca5a5",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    textAlign: "center"
  },
  footer: {
    color: "#94a3b8",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "8px"
  },
  link: {
    color: "#60a5fa",
    textDecoration: "none",
    fontWeight: "500"
  }
};

export default Login;
