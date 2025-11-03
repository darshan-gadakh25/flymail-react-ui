import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as authService from "../../services/authService";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from location state or localStorage
    const emailFromState = location.state?.email;
    const emailFromStorage = localStorage.getItem("resetEmail");
    
    if (emailFromState) {
      setEmail(emailFromState);
      localStorage.setItem("resetEmail", emailFromState);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      // If no email, redirect to forgot password
      navigate("/forgot-password");
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validation
    if (!formData.otp || formData.otp.length !== 6) {
      setMessage("Please enter a valid 6-digit OTP");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(email, formData.otp, formData.newPassword);
      setSuccess(true);
      localStorage.removeItem("resetEmail");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.form}>
          <h2 style={styles.title}>Password Reset Successful!</h2>
          <p style={styles.successMessage}>
            Your password has been reset successfully. Redirecting to login...
          </p>
          <Link to="/login" style={styles.linkText}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.subtitle}>Enter the OTP sent to your email and your new password</p>
        
        <input
          type="text"
          name="otp"
          placeholder="Enter 6-digit OTP"
          value={formData.otp}
          onChange={handleChange}
          style={styles.input}
          required
          maxLength={6}
          pattern="[0-9]{6}"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          style={styles.input}
          required
          minLength={6}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          style={styles.input}
          required
        />
        
        <button 
          type="submit" 
          style={{
            ...styles.button,
            background: loading ? "#ccc" : "#0b6efd",
            cursor: loading ? "not-allowed" : "pointer",
          }} 
          disabled={loading}
        >
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>
        
        {message && <p style={styles.message}>{message}</p>}
        
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
    marginBottom: "15px",
  },
};

