import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthModal from './auth/AuthModal';

export default function AboutPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        background: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '15px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
            <h2>FlyMail</h2>
          </div>
          <div style={{ display: 'flex', gap: '30px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#333', fontSize: '16px', fontWeight: '500' }}>
              Home
            </Link>
            <Link to="/about" style={{ textDecoration: 'none', color: '#10b981', fontSize: '16px', fontWeight: '500' }}>
              About Us
            </Link>
            <Link to="/contact" style={{ textDecoration: 'none', color: '#333', fontSize: '16px', fontWeight: '500' }}>
              Contact Us
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={() => openAuthModal('login')}
              style={{
                background: 'transparent',
                color: '#333',
                fontSize: '16px',
                fontWeight: '500',
                padding: '8px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('register')}
              style={{
                background: '#10b981',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '500',
                padding: '8px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '80px 20px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
              About FlyMail
            </h1>
            <p style={{ fontSize: '20px', color: '#666', maxWidth: '800px', margin: '0 auto' }}>
              We're revolutionizing email communication with modern technology and user-centric design.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px',
            marginBottom: '80px'
          }}>
            <div style={{
              background: '#fff',
              padding: '40px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
                Our Mission
              </h3>
              <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
                To provide a seamless, secure, and efficient email experience that connects people and businesses worldwide. We believe communication should be simple, fast, and reliable.
              </p>
            </div>

            <div style={{
              background: '#fff',
              padding: '40px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
                Our Vision
              </h3>
              <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
                To become the leading email platform that empowers users with cutting-edge features while maintaining the highest standards of privacy and security.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#333', marginBottom: '40px' }}>
              Why Choose FlyMail?
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}>
              <div style={{
                background: '#fff',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚡</div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>
                  Lightning Fast
                </h3>
                <p style={{ color: '#666' }}>
                  Experience blazing fast email delivery and retrieval with our optimized infrastructure.
                </p>
              </div>

              <div style={{
                background: '#fff',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>
                  Secure & Private
                </h3>
                <p style={{ color: '#666' }}>
                  Your emails are encrypted and protected with enterprise-grade security measures.
                </p>
              </div>

              <div style={{
                background: '#fff',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>📱</div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>
                  Fully Responsive
                </h3>
                <p style={{ color: '#666' }}>
                  Works perfectly on all devices - desktop, tablet, and mobile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer style={{
        background: '#333',
        color: '#fff',
        textAlign: 'center',
        padding: '30px 20px'
      }}>
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