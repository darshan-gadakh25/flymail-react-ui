import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await authService.requestOTP(email);
      localStorage.setItem("resetEmail", email);
      setSuccess(true);
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSendOtp} style={styles.form}>
        <h2 style={styles.title}>Forgot Password</h2>
        <p style={styles.subtitle}>
          Enter your email address and we'll send you an OTP to reset your password.
        </p>
        
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          style={styles.input}
        />
        
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>OTP sent successfully! Redirecting...</p>}
        
        <button 
          type="submit" 
          disabled={loading} 
          style={{
            ...styles.button,
            background: loading ? "#ccc" : "#0b6efd",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
        
        <p style={styles.link}>
          <Link to="/login" style={styles.linkText}>Back to Login</Link>
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
  title: {
    marginBottom: "10px",
    color: "#333",
  },
  subtitle: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#666",
  },
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
  error: {
    marginTop: "10px",
    color: "#d63384",
    fontSize: "14px",
    fontWeight: "500",
  },
  success: {
    marginTop: "10px",
    color: "#28a745",
    fontSize: "14px",
    fontWeight: "500",
  },
};
