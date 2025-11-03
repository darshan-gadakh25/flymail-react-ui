import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as mailService from '../../services/mailService';

export default function Sidebar({ isOpen, onToggle, activeSection, onSectionChange }) {
  const { user } = useAuth();
  const [showCompose, setShowCompose] = useState(false);
  const [mailCounts, setMailCounts] = useState({ inbox: 0, sent: 0, drafts: 0 });
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadMailCounts();
  }, []);

  const loadMailCounts = async () => {
    try {
      const [inboxRes, sentRes, draftsRes] = await Promise.all([
        mailService.getInbox().catch(() => ({ data: [] })),
        mailService.getSent().catch(() => ({ data: [] })),
        mailService.getDrafts().catch(() => ({ data: [] }))
      ]);

      const inbox = inboxRes.data || inboxRes.mails || [];
      const sent = sentRes.data || sentRes.mails || [];
      const drafts = draftsRes.data || draftsRes.mails || [];

      setMailCounts({
        inbox: inbox.filter(mail => !mail.isRead && !mail.read).length,
        sent: sent.length,
        drafts: drafts.length
      });
    } catch (error) {
      console.error('Error loading mail counts:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'inbox', label: 'Inbox', icon: '📥', badge: mailCounts.inbox },
    { id: 'sent', label: 'Sent', icon: '📤', badge: mailCounts.sent },
    { id: 'drafts', label: 'Drafts', icon: '📝', badge: mailCounts.drafts },
  ];

  if (isAdmin) {
    menuItems.push({ id: 'admin', label: 'Admin Panel', icon: '⚙️' });
  }

  const handleSectionClick = (sectionId) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
    if (window.innerWidth <= 768) {
      onToggle();
    }
    // Refresh counts when switching sections
    setTimeout(() => loadMailCounts(), 500);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 998,
            display: window.innerWidth <= 768 ? 'block' : 'none'
          }}
          onClick={onToggle}
        />
      )}

      <aside style={{
        width: '280px',
        background: '#fff',
        borderRight: '1px solid #e5e7eb',
        height: '100vh',
        position: 'fixed',
        left: isOpen ? 0 : '-280px',
        top: 0,
        zIndex: 999,
        transition: 'left 0.3s ease',
        paddingTop: '70px',
        boxShadow: isOpen ? '2px 0 10px rgba(0,0,0,0.1)' : 'none'
      }}>
        <div style={{ padding: '20px' }}>
          <button
            onClick={() => setShowCompose(true)}
            style={{
              width: '100%',
              background: '#0b6efd',
              color: '#fff',
              border: 'none',
              padding: '15px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            ✏️ Compose
          </button>

          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {menuItems.map((item) => (
                <li key={item.id} style={{ marginBottom: '8px' }}>
                  <button
                    onClick={() => handleSectionClick(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: activeSection === item.id ? '#f0f7ff' : 'transparent',
                      color: activeSection === item.id ? '#0b6efd' : '#333',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: activeSection === item.id ? '600' : '500',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge > 0 && (
                      <span style={{
                        background: item.id === 'inbox' ? '#ef4444' : '#6b7280',
                        color: '#fff',
                        fontSize: '12px',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        minWidth: '18px',
                        textAlign: 'center'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Compose Modal */}
      {showCompose && (
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
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Compose Email</h3>
              <button
                onClick={() => setShowCompose(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                  type="email"
                  placeholder="To"
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                <input
                  type="text"
                  placeholder="Subject"
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                <textarea
                  placeholder="Write your message..."
                  rows="10"
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowCompose(false)}
                    style={{
                      padding: '10px 20px',
                      background: '#f3f4f6',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: '10px 20px',
                      background: '#6b7280',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      background: '#0b6efd',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}