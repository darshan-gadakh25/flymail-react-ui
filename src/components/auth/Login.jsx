import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from '../Toast';
import * as authService from '../../services/authService';

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: otp+password
  const [forgotData, setForgotData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  const [forgotLoading, setForgotLoading] = useState(false);
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
      toast.success('Login successful!');
      navigate("/dashboard");
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Something went wrong. Please try again.";
      setMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);

    try {
      if (forgotStep === 1) {
        await authService.requestOTP(forgotData.email);
        toast.success('OTP sent to your email!');
        setForgotStep(2);
      } else {
        if (forgotData.newPassword !== forgotData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        await authService.resetPassword(forgotData.email, forgotData.otp, forgotData.newPassword);
        toast.success('Password reset successfully!');
        setShowForgotModal(false);
        setForgotStep(1);
        setForgotData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      console.error('Login forgot password error:', error);
      let errorMessage = 'Failed to process request';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data) {
        const responseData = error.response.data;
        if (typeof responseData === 'string') {
          // Extract error from HTML response
          const htmlMatch = responseData.match(/Error: ([^<]+)/);
          if (htmlMatch) {
            errorMessage = htmlMatch[1].trim();
          } else {
            errorMessage = responseData;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setForgotLoading(false);
    }
  };

  const openForgotModal = () => {
    setShowForgotModal(true);
    setForgotStep(1);
    setForgotData({ email: formData.email, otp: '', newPassword: '', confirmPassword: '' });
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotStep(1);
    setForgotData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
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
            background: loading ? "#ccc" : "#10b981",
            cursor: loading ? "not-allowed" : "pointer",
          }} 
          type="submit" 
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
        {message && <p style={styles.message}>{message}</p>}
        <div style={styles.linkContainer}>
          <p style={styles.link}>
            Don't have an account? <Link to="/register" style={styles.linkText}>Sign up</Link>
          </p>
          <p style={styles.link}>
            <span 
              onClick={openForgotModal}
              style={styles.forgotLink}
            >
              Forgot Password?
            </span>
          </p>
        </div>
      </form>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {forgotStep === 1 ? 'Reset Password' : 'Enter OTP & New Password'}
              </h3>
              <button onClick={closeForgotModal} style={styles.closeButton}>×</button>
            </div>
            
            <form onSubmit={handleForgotPassword} style={styles.modalForm}>
              {forgotStep === 1 ? (
                <>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={forgotData.email}
                    onChange={(e) => setForgotData({...forgotData, email: e.target.value})}
                    style={styles.input}
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={forgotLoading}
                    style={{
                      ...styles.button,
                      background: forgotLoading ? '#ccc' : '#10b981',
                      cursor: forgotLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {forgotLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={forgotData.otp}
                    onChange={(e) => setForgotData({...forgotData, otp: e.target.value})}
                    style={styles.input}
                    required
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={forgotData.newPassword}
                    onChange={(e) => setForgotData({...forgotData, newPassword: e.target.value})}
                    style={styles.input}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={forgotData.confirmPassword}
                    onChange={(e) => setForgotData({...forgotData, confirmPassword: e.target.value})}
                    style={styles.input}
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={forgotLoading}
                    style={{
                      ...styles.button,
                      background: forgotLoading ? '#ccc' : '#10b981',
                      cursor: forgotLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {forgotLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
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
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    marginTop: "5px",
  },

  linkContainer: {
    marginTop: "15px",
  },
  link: {
    margin: "5px 0",
    fontSize: "14px",
    color: "#666",
  },
  linkText: {
    color: "#10b981",
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
  forgotLink: {
    color: '#10b981',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'inline-block',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 20px 0 20px',
  },
  modalTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
  },
  modalForm: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
};
