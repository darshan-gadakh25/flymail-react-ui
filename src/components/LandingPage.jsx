import { useState } from 'react';
import { Link } from "react-router-dom";
import AuthModal from './auth/AuthModal';

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

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
          }}
        >
          <div
            style={{ fontSize: "24px", fontWeight: "bold", color: "#0b6efd" }}
          >
            <h2> FlyMail</h2>
          </div>
          <div style={{ display: "flex", gap: "30px" }}>
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
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={() => openAuthModal('login')}
              style={{
                background: 'transparent',
                color: "#333",
                fontSize: "16px",
                fontWeight: "500",
                padding: "8px 20px",
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
                fontSize: "16px",
                fontWeight: "500",
                padding: "8px 20px",
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
          padding: "100px 20px",
          textAlign: "center",
          color: "#fff",
          flex: 1,
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Welcome to FlyMail
          </h1>
          <p style={{ fontSize: "24px", marginBottom: "15px", opacity: 0.95 }}>
            Your modern email solution for seamless communication
          </p>
          <p style={{ fontSize: "18px", marginBottom: "40px", opacity: 0.9 }}>
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
                padding: "15px 40px",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "600",
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Get Started
            </button>
            <Link
              to="/about"
              style={{
                background: "transparent",
                color: "#fff",
                padding: "15px 40px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "18px",
                fontWeight: "600",
                border: "2px solid #fff",
              }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>
      <section style={{ padding: "80px 20px", background: "#f8f9fa" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "36px",
              marginBottom: "50px",
              color: "#333",
            }}
          >
            Why Choose FlyMail?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "40px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "20px" }}></div>
              <h3>Lightning Fast</h3>
              <p>Experience blazing fast email delivery and retrieval</p>
            </div>
            <div
              style={{
                background: "#fff",
                padding: "40px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "20px" }}></div>
              <h3>Secure</h3>
              <p>Your emails are encrypted and protected at all times</p>
            </div>
            <div
              style={{
                background: "#fff",
                padding: "40px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "20px" }}></div>
              <h3>Responsive</h3>
              <p>Works perfectly on all devices and screen sizes</p>
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
