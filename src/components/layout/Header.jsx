import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header style={{
      background: '#fff',
      padding: '15px 20px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button
          onClick={onMenuClick}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '5px',
            display: 'block'
          }}
        >
          ☰
        </button>
        <h1 style={{ color: '#0b6efd', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>FlyMail</h1>
      </div>
      
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            background: '#f3f4f6',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#0b6efd',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>{user?.name}</span>
          <span style={{ fontSize: '12px' }}>▼</span>
        </button>

        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            minWidth: '200px',
            marginTop: '5px',
            zIndex: 1000
          }}>
            <div style={{ padding: '15px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ fontWeight: '500', fontSize: '14px' }}>{user?.name}</div>
              <div style={{ color: '#666', fontSize: '12px' }}>{user?.email}</div>
              <div style={{ color: '#0b6efd', fontSize: '12px', textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
            <button
              onClick={() => {
                logout();
                setShowDropdown(false);
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                padding: '12px 15px',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#ef4444',
                fontSize: '14px'
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}