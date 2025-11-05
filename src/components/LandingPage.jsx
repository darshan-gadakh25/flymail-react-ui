import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import AuthModal from './auth/AuthModal';

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [ setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // const isMobile = windowWidth <= 768;
  // const isSmallMobile = windowWidth <= 480;

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <nav
        style={{
          background: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          padding: "15px 0",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px"
          }}
        >
          <div
            style={{ fontSize: "24px", fontWeight: "bold", color: "#0b6efd" }}
          >
            <h2> FlyMail</h2>
          </div>
          <div style={{ 
            display: window.innerWidth > 768 ? "flex" : "none", 
            gap: "30px" 
          }}>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "#333",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Home
            </Link>
            <Link
              to="/about"
              style={{
                textDecoration: "none",
                color: "#333",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              style={{
                textDecoration: "none",
                color: "#333",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Contact Us
            </Link>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => openAuthModal('login')}
              style={{
                background: 'transparent',
                color: "#333",
                fontSize: window.innerWidth > 480 ? "16px" : "14px",
                fontWeight: "500",
                padding: window.innerWidth > 480 ? "8px 20px" : "6px 15px",
                borderRadius: "6px",
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('register')}
              style={{
                background: "#0b6efd",
                color: "#fff",
                fontSize: window.innerWidth > 480 ? "16px" : "14px",
                fontWeight: "500",
                padding: window.innerWidth > 480 ? "8px 20px" : "6px 15px",
                borderRadius: "6px",
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>
      <main
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: window.innerWidth > 768 ? "100px 20px" : "60px 20px",
          textAlign: "center",
          color: "#fff",
          flex: 1,
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: window.innerWidth > 768 ? "48px" : window.innerWidth > 480 ? "36px" : "28px",
              fontWeight: "bold",
              marginBottom: "20px",
              lineHeight: "1.2"
            }}
          >
            Welcome to FlyMail
          </h1>
          <p style={{ 
            fontSize: window.innerWidth > 768 ? "24px" : window.innerWidth > 480 ? "20px" : "18px", 
            marginBottom: "15px", 
            opacity: 0.95 
          }}>
            Your modern email solution for seamless communication
          </p>
          <p style={{ 
            fontSize: window.innerWidth > 768 ? "18px" : "16px", 
            marginBottom: "40px", 
            opacity: 0.9,
            lineHeight: "1.5"
          }}>
            Send, receive, and manage your emails all in one place. Fast,
            secure, and easy to use.
          </p>
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => openAuthModal('register')}
              style={{
                background: "#fff",
                color: "#0b6efd",
                padding: window.innerWidth > 480 ? "15px 40px" : "12px 30px",
                borderRadius: "8px",
                fontSize: window.innerWidth > 480 ? "18px" : "16px",
                fontWeight: "600",
                border: 'none',
                cursor: 'pointer',
                minWidth: "140px"
              }}
            >
              Get Started
            </button>
            <Link
              to="/about"
              style={{
                background: "transparent",
                color: "#fff",
                padding: window.innerWidth > 480 ? "15px 40px" : "12px 30px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: window.innerWidth > 480 ? "18px" : "16px",
                fontWeight: "600",
                border: "2px solid #fff",
                minWidth: "140px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>
      <section style={{ 
        padding: window.innerWidth > 768 ? "80px 20px" : "40px 20px", 
        background: "#f8f9fa" 
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: window.innerWidth > 768 ? "36px" : window.innerWidth > 480 ? "28px" : "24px",
              marginBottom: window.innerWidth > 768 ? "50px" : "30px",
              color: "#333",
            }}
          >
            Why Choose FlyMail?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: window.innerWidth > 768 ? "repeat(auto-fit, minmax(300px, 1fr))" : "1fr",
              gap: window.innerWidth > 768 ? "30px" : "20px",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: window.innerWidth > 768 ? "40px" : "30px 20px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚡</div>
              <h3 style={{ fontSize: window.innerWidth > 480 ? "20px" : "18px", marginBottom: "10px" }}>Lightning Fast</h3>
              <p style={{ fontSize: window.innerWidth > 480 ? "16px" : "14px", color: "#666" }}>Experience blazing fast email delivery and retrieval</p>
            </div>
            <div
              style={{
                background: "#fff",
                padding: window.innerWidth > 768 ? "40px" : "30px 20px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔒</div>
              <h3 style={{ fontSize: window.innerWidth > 480 ? "20px" : "18px", marginBottom: "10px" }}>Secure</h3>
              <p style={{ fontSize: window.innerWidth > 480 ? "16px" : "14px", color: "#666" }}>Your emails are encrypted and protected at all times</p>
            </div>
            <div
              style={{
                background: "#fff",
                padding: window.innerWidth > 768 ? "40px" : "30px 20px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>📱</div>
              <h3 style={{ fontSize: window.innerWidth > 480 ? "20px" : "18px", marginBottom: "10px" }}>Responsive</h3>
              <p style={{ fontSize: window.innerWidth > 480 ? "16px" : "14px", color: "#666" }}>Works perfectly on all devices and screen sizes</p>
            </div>
          </div>
        </div>
      </section>
      <footer
        style={{
          background: "#333",
          color: "#fff",
          textAlign: "center",
          padding: "30px 20px",
        }}
      >
        <p>&copy; 2025 FlyMail. All rights reserved.</p>
      </footer>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={setAuthMode}
        />
      )}
    </div>
  );
}
