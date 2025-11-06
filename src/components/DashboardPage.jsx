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
  const [showMailViewer, setShowMailViewer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
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

  const handleSearch = async (query) => {
    if (!query.trim()) {
      loadMails();
      return;
    }
    
    setIsSearching(true);
    try {
      console.log('Searching for:', query);
      console.log('Search API endpoint will be:', `/mail/search?q=${query}`);
      const response = await mailService.searchMails(query);
      console.log('Search API response:', response);
      console.log('Search results count:', response.count);
      console.log('Search results mails:', response.mails);
      
      const searchResults = response.mails || response.data || [];
      console.log('Final search results to display:', searchResults);
      setMails(searchResults);
      
      if (searchResults.length === 0) {
        toast.info(`No results found for "${query}"`);
      } else {
        toast.success(`Found ${searchResults.length} result(s) for "${query}"`);
      }
    } catch (error) {
      console.error('Error searching mails:', error);
      console.log('Search error response:', error.response);
      let errorMessage = 'Failed to search emails';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
      setMails([]);
    } finally {
      setIsSearching(false);
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
              onClick={() => {
                setSelectedMail(mail);
                setShowMailViewer(true);
                if (!mail.isRead) {
                  handleMarkAsRead(mail._id);
                }
              }}
            >
              <div className="flex-responsive" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{
                      fontWeight: mail.isRead ? '500' : '700',
                      color: '#333',
                      fontSize: '16px'
                    }}>
                      {activeSection === 'sent' 
                        ? (mail.receiver?.name || mail.toName || mail.to?.split('@')[0] || mail.to || 'Unknown')
                        : (mail.sender?.name || mail.fromName || mail.from?.split('@')[0] || mail.from || 'Unknown Sender')
                      }
                    </span>
                    {!mail.isRead && (
                      <span style={{
                        width: '8px',
                        height: '8px',
                        background: '#22c55e',
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
      
      {showMailViewer && selectedMail && (
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
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              background: '#f8f9fa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{
                    margin: '0 0 10px 0',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    {selectedMail.subject || 'No Subject'}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '600', color: '#666' }}>From:</span>
                      <span style={{ color: '#333' }}>
                        {selectedMail.sender?.name || selectedMail.fromName || selectedMail.from?.split('@')[0] || selectedMail.from || 'Unknown'}
                        {(selectedMail.sender?.email || selectedMail.from) && (
                          <span style={{ color: '#666', fontSize: '14px', marginLeft: '8px' }}>({selectedMail.sender?.email || selectedMail.from})</span>
                        )}
                      </span>
                    </div>
                    {selectedMail.to && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '600', color: '#666' }}>To:</span>
                        <span style={{ color: '#333' }}>
                          {selectedMail.receiver?.name || selectedMail.toName || selectedMail.to?.split('@')[0] || selectedMail.to}
                          {(selectedMail.receiver?.email || selectedMail.to) && (
                            <span style={{ color: '#666', fontSize: '14px', marginLeft: '8px' }}>({selectedMail.receiver?.email || selectedMail.to})</span>
                          )}
                        </span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '600', color: '#666' }}>Date:</span>
                      <span style={{ color: '#333' }}>
                        {new Date(selectedMail.createdAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowMailViewer(false);
                    setSelectedMail(null);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  ×
                </button>
              </div>
            </div>
            
            <div style={{
              padding: '30px',
              lineHeight: '1.6',
              fontSize: '16px',
              color: '#333'
            }}>
              <div style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {selectedMail.body || 'No content'}
              </div>
            </div>
            
            <div style={{
              padding: '20px',
              borderTop: '1px solid #e5e7eb',
              background: '#f8f9fa',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  setShowMailViewer(false);
                  setSelectedMail(null);
                }}
                style={{
                  background: '#6b7280',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}