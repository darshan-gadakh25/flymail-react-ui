import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    // Check for success message from navigation state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to prevent showing the message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(""); // Clear message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await login(formData);
      // Navigate to dashboard or home
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Login</h2>
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          required
        />
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <button 
          style={{
            ...styles.button,
            background: loading ? "#ccc" : "#0b6efd",
            cursor: loading ? "not-allowed" : "pointer",
          }} 
          type="submit" 
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p style={styles.forgotLink}>
          <Link to="/forgot-password" style={styles.linkText}>Forgot Password?</Link>
        </p>
        {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
        {message && <p style={styles.message}>{message}</p>}
        <p style={styles.link}>
          Don't have an account? <Link to="/register" style={styles.linkText}>Sign up</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f7fb",
  },
  form: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "350px",
    textAlign: "center",
  },
  title: { marginBottom: "20px", color: "#333" },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#0b6efd",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    marginTop: "5px",
  },
  forgotLink: {
    marginTop: "5px",
    marginBottom: "5px",
    fontSize: "14px",
    textAlign: "right",
  },
  link: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#666",
  },
  linkText: {
    color: "#0b6efd",
    textDecoration: "none",
    fontWeight: "500",
  },
  message: {
    marginTop: "10px",
    color: "#d63384",
    fontSize: "14px",
    fontWeight: "500",
  },
  successMessage: {
    marginTop: "10px",
    color: "#28a745",
    fontSize: "14px",
    fontWeight: "500",
  },
};
