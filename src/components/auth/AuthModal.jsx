import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '../Toast';
import * as authService from '../../services/authService';

export default function AuthModal({ mode, onClose, onSwitchMode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotData, setForgotData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  const [forgotLoading, setForgotLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 480;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        // Validate email and password before sending request
        if (!formData.email || !formData.password) {
          const errorMsg = 'Please enter both email and password';
          setError(errorMsg);
          toast.error(errorMsg);
          setLoading(false);
          return;
        }
        
        await login({ email: formData.email, password: formData.password });
        toast.success('Login successful!');
        onClose();
        navigate('/dashboard');
      } else {
        if (formData.password !== formData.confirmPassword) {
          const errorMsg = 'Passwords do not match';
          setError(errorMsg);
          toast.error(errorMsg);
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          const errorMsg = 'Password must be at least 6 characters';
          setError(errorMsg);
          toast.error(errorMsg);
          setLoading(false);
          return;
        }
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        toast.success('Registration successful!');
        onClose();
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Auth error:', err);
      let errorMessage = 'An error occurred';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid request. Please check your input.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
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
      padding: isMobile ? '10px' : '20px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: isMobile ? '20px' : '40px',
        width: '100%',
        maxWidth: '450px',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>

        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          {mode === 'login' ? 'Sign In' : 'Sign Up'}
        </h2>

        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px'
              }}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px'
              }}
              placeholder="Enter your password"
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                  placeholder="Confirm your password"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#ccc' : '#059669',
              color: '#fff',
              padding: '15px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px'
            }}
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ color: '#666' }}>
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#059669',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
          {mode === 'login' && (
            <>
              <br />
              <button
                onClick={() => {
                  setShowForgotModal(true);
                  setForgotStep(1);
                  setForgotData({ email: formData.email, otp: '', newPassword: '', confirmPassword: '' });
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#059669',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginTop: '10px',
                  fontSize: '14px'
                }}
              >
                Forgot Password?
              </button>
            </>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '400px',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotStep(1);
                setForgotData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
              }}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>

            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {forgotStep === 1 ? 'Reset Password' : 'Enter OTP & New Password'}
            </h3>
            
            <form onSubmit={async (e) => {
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
                console.error('AuthModal forgot password error:', error);
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
            }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {forgotStep === 1 ? (
                <>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={forgotData.email}
                    onChange={(e) => setForgotData({...forgotData, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={forgotLoading}
                    style={{
                      background: forgotLoading ? '#ccc' : '#10b981',
                      color: '#fff',
                      padding: '12px',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: '600',
                      border: 'none',
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
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={forgotData.newPassword}
                    onChange={(e) => setForgotData({...forgotData, newPassword: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={forgotData.confirmPassword}
                    onChange={(e) => setForgotData({...forgotData, confirmPassword: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={forgotLoading}
                    style={{
                      background: forgotLoading ? '#ccc' : '#10b981',
                      color: '#fff',
                      padding: '12px',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: '600',
                      border: 'none',
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