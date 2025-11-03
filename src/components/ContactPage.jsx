import { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./auth/AuthModal";

export default function ContactPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

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
            <h2>📧 FlyMail</h2>
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
                fontWeight: "bold",
              }}
            >
              Contact Us
            </Link>
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={() => openAuthModal("login")}
              style={{
                background: "transparent",
                color: "#333",
                fontSize: "16px",
                fontWeight: "500",
                padding: "8px 20px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal("register")}
              style={{
                background: "#0b6efd",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "500",
                padding: "8px 20px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>
      <main style={{ flex: 1, padding: "60px 20px", background: "#f8f9fa" }}>
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            background: "#fff",
            padding: "50px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              marginBottom: "10px",
              color: "#333",
              textAlign: "center",
            }}
          >
            Contact Us
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#666",
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            Have a question or feedback? We'd love to hear from you!
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "30px",
              marginBottom: "50px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "30px",
                background: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "15px" }}>📧</div>
              <h3>Email</h3>
              <p>support@flymail.com</p>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "30px",
                background: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "15px" }}>📞</div>
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "30px",
                background: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "15px" }}>📍</div>
              <h3>Address</h3>
              <p>123 Tech Street, Digital City, DC 12345</p>
            </div>
          </div>
          <section style={{ marginTop: "40px" }}>
            <h2
              style={{
                fontSize: "28px",
                marginBottom: "20px",
                color: "#0b6efd",
              }}
            >
              Send us a Message
            </h2>
            <form
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}
                >
                  Name
                </label>
                <input
                  type="text"
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "16px",
                  }}
                  placeholder="Your name"
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "16px",
                  }}
                  placeholder="your@email.com"
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}
                >
                  Message
                </label>
                <textarea
                  rows="6"
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "16px",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                  placeholder="Your message"
                ></textarea>
              </div>
              <button
                type="submit"
                style={{
                  background: "#0b6efd",
                  color: "#fff",
                  padding: "15px 40px",
                  borderRadius: "8px",
                  fontSize: "18px",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: "none",
                  alignSelf: "flex-start",
                }}
              >
                Send Message
              </button>
            </form>
          </section>
        </div>
      </main>
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
