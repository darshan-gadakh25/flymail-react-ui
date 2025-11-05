import { useState, useEffect } from 'react';

let toastId = 0;

export const toast = {
  success: (message) => showToast(message, 'success'),
  error: (message) => showToast(message, 'error'),
  info: (message) => showToast(message, 'info')
};

let addToast = null;

function showToast(message, type) {
  if (addToast) {
    addToast({ id: ++toastId, message, type });
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    addToast = (toast) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 4000);
    };
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 480;

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div style={{
      position: 'fixed',
      top: isMobile ? '10px' : '20px',
      right: isMobile ? '10px' : '20px',
      left: isMobile ? '10px' : 'auto',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            background: toast.type === 'error' ? '#ef4444' : toast.type === 'success' ? '#10b981' : '#3b82f6',
            color: '#fff',
            padding: isMobile ? '10px 12px' : '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: isMobile ? 'auto' : '300px',
            width: isMobile ? '100%' : 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            animation: 'slideIn 0.3s ease',
            fontSize: isMobile ? '14px' : '16px'
          }}
        >
          <span style={{ flex: 1, wordBreak: 'break-word' }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '18px',
              marginLeft: '10px',
              flexShrink: 0
            }}
          >
            ×
          </button>
        </div>
      ))}
      <style>
        {`
          @keyframes slideIn {
            from { 
              transform: ${isMobile ? 'translateY(-100%)' : 'translateX(100%)'}; 
              opacity: 0; 
            }
            to { 
              transform: ${isMobile ? 'translateY(0)' : 'translateX(0)'}; 
              opacity: 1; 
            }
          }
        `}
      </style>
    </div>
  );
}