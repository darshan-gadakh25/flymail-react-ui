import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from './Toast';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import * as mailService from '../services/mailService';

export default function DashboardPage({ activeSection = 'dashboard', onSectionChange }) {
  const { user } = useAuth();
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const isAdmin = user?.role === 'admin';

  const loadMails = async (section = activeSection) => {
    if (section === 'dashboard' || section === 'admin') return;
    
    setLoading(true);
    try {
      let response;
      switch (section) {
        case 'inbox':
          response = await mailService.getInbox();
          break;
        case 'sent':
          response = await mailService.getSent();
          break;
        case 'drafts':
          response = await mailService.getDrafts();
          break;
        default:
          response = await mailService.getInbox();
      }
      setMails(response.mails || response.data || []);
    } catch (error) {
      console.error('Error loading mails:', error);
      toast.error(error.response?.data?.message || `Failed to load ${section}`);
      setMails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (mailId) => {
    try {
 
      await mailService.markAsRead(mailId);
      toast.success('Mail marked as read');
      setMails(prevMails => 
        prevMails.map(mail => 
          mail._id === mailId ? { ...mail, isRead: true, read: true } : mail
        )
      );
    } catch (error) {
      console.error('Error marking mail as read:', error);
      toast.error(error.response?.data?.message || 'Failed to mark as read');
    }
  };

  const handleDeleteMail = async (mailId) => {
    if (!window.confirm('Are you sure you want to delete this email?')) {
      return;
    }
    
    try {
      await mailService.deleteMail(mailId);
      toast.success('Mail deleted successfully');
      // Remove from local state
      setMails(prevMails => prevMails.filter(mail => mail._id !== mailId));
    } catch (error) {
      console.error('Error deleting mail:', error);
      toast.error(error.response?.data?.message || 'Failed to delete mail');
    }
  };

  useEffect(() => {
    if (activeSection !== 'dashboard' && activeSection !== 'admin') {
      loadMails();
    }
  }, [activeSection]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return isAdmin ? <AdminDashboard /> : <UserDashboard />;
      case 'admin':
        return isAdmin ? <AdminDashboard /> : <UserDashboard />;
      case 'inbox':
      case 'sent':
      case 'drafts':
        return renderMailList();
      default:
        return isAdmin ? <AdminDashboard /> : <UserDashboard />;
    }
  };

  const renderMailList = () => (
    <div className="padding-mobile" style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 className="title-mobile" style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', textTransform: 'capitalize' }}>
          {activeSection}
        </h2>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading...</div>
        </div>
      ) : mails.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
          <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '10px' }}>No emails found</h3>
          <p style={{ color: '#666' }}>Your {activeSection} is empty</p>
        </div>
      ) : (
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {mails.map((mail, index) => (
            <div
              key={mail._id || index}
              style={{
                padding: '20px',
                borderBottom: index < mails.length - 1 ? '1px solid #e5e7eb' : 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
                background: mail.isRead ? '#fff' : '#f0f7ff'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = mail.isRead ? '#fff' : '#f0f7ff'}
            >
              <div className="flex-responsive" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{
                      fontWeight: mail.isRead ? '500' : '700',
                      color: '#333',
                      fontSize: '16px'
                    }}>
                      {activeSection === 'sent' ? mail.to : mail.from}
                    </span>
                    {!mail.isRead && (
                      <span style={{
                        width: '8px',
                        height: '8px',
                        background: '#3b82f6',
                        borderRadius: '50%'
                      }} />
                    )}
                  </div>
                  <h4 style={{
                    margin: '0 0 8px 0',
                    fontSize: '16px',
                    fontWeight: mail.isRead ? '500' : '700',
                    color: '#333'
                  }}>
                    {mail.subject || 'No Subject'}
                  </h4>
                  <p style={{
                    margin: 0,
                    color: '#666',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    {mail.body?.substring(0, 120)}...
                  </p>
                </div>
                <div style={{ textAlign: 'right', marginLeft: '20px', minWidth: 'fit-content' }}>
                  <div style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>
                    {new Date(mail.createdAt).toLocaleDateString()}
                  </div>
                  <div style={{ color: '#666', fontSize: '11px', marginBottom: '8px' }}>
                    {new Date(mail.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                    {activeSection === 'inbox' && !mail.isRead && !mail.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(mail._id);
                        }}
                        style={{
                          background: '#10b981',
                          color: '#fff',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMail(mail._id);
                      }}
                      style={{
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      {renderContent()}
    </div>
  );
}