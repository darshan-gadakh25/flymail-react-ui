import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from './Toast';
import * as mailService from '../services/mailService';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    unread: 0,
    sentToday: 0,
    drafts: 0,
    total: 0
  });
  const [recentMails, setRecentMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const [showMailViewer, setShowMailViewer] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [inboxRes, sentRes, draftsRes] = await Promise.all([
        mailService.getInbox().catch(() => ({ mails: [], count: 0 })),
        mailService.getSent().catch(() => ({ mails: [], count: 0 })),
        mailService.getDrafts().catch(() => ({ mails: [], count: 0 }))
      ]);

      const inbox = inboxRes.mails || inboxRes.data || [];
      const sent = sentRes.mails || sentRes.data || [];
      const drafts = draftsRes.mails || draftsRes.data || [];

      const today = new Date().toDateString();
      const sentToday = sent.filter(mail => 
        new Date(mail.createdAt || mail.date).toDateString() === today
      ).length;

      setStats({
        unread: inbox.filter(mail => !mail.isRead && !mail.read).length,
        sentToday,
        drafts: drafts.length,
        total: inbox.length
      });

      setRecentMails(inbox.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (mailId) => {
    try {
      await mailService.markAsRead(mailId);
      toast.success('Mail marked as read');
      loadDashboardData();
    } catch (error) {
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
      // Refresh dashboard data
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete mail');
    }
  };

  const handleCompose = async (mailData) => {
    try {
      const composeMail = {
        toEmail: mailData.to,
        subject: mailData.subject,
        body: mailData.body,
        isDraft: false
      };

      const result = await mailService.composeMail(composeMail);
      console.log('Mail sent successfully:', result);
      setShowCompose(false);
      toast.success('Email sent successfully!');
      loadDashboardData();
    } catch (error) {
      console.error('Error sending mail:', error);
      console.log('Error response data:', error.response?.data);
      let errorMessage = 'Failed to send email';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchQuery('');
      return;
    }
    
    setIsSearching(true);
    try {
      console.log('Searching for:', query);
      const response = await mailService.searchMails(query);
      console.log('Search results:', response);
      
      const results = response.mails || response.data || [];
      setSearchResults(results);
      
      if (results.length === 0) {
        toast.info(`No results found for "${query}"`);
      } else {
        toast.success(`Found ${results.length} result(s) for "${query}"`);
      }
    } catch (error) {
      console.error('Error searching mails:', error);
      let errorMessage = 'Failed to search emails';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="padding-mobile" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 className="title-mobile" style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Here's your email overview for today</p>
      </div>

      <div className="grid-responsive" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '32px' }}>📥</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{stats.unread}</h3>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Unread Emails</p>
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: '#fff',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '32px' }}>📤</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{stats.sentToday}</h3>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Sent Today</p>
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: '#fff',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '32px' }}>📝</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{stats.drafts}</h3>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Draft Emails</p>
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          color: '#fff',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '32px' }}>📊</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{stats.total}</h3>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Total Emails</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '30px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowCompose(true)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          ✏️ Compose New Email
        </button>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1, minWidth: '300px' }}>
          <input
            type="text"
            placeholder="Search all emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(searchQuery);
              }
            }}
            style={{
              flex: 1,
              padding: '12px 15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            onClick={() => handleSearch(searchQuery)}
            disabled={isSearching}
            style={{
              background: isSearching ? '#ccc' : '#10b981',
              color: '#fff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: isSearching ? 'not-allowed' : 'pointer',
              fontWeight: '500'
            }}
          >
            {isSearching ? 'Searching...' : '🔍 Search'}
          </button>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              style={{
                background: '#6b7280',
                color: '#fff',
                border: 'none',
                padding: '12px 15px',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '25px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: 0 }}>
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Recent Emails'}
          </h2>
          <span style={{ color: '#666', fontSize: '14px' }}>
            {searchQuery ? `${searchResults.length} result(s)` : `${recentMails.length} of ${stats.total} emails`}
          </span>
        </div>

        {isSearching ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <div style={{ fontSize: '18px' }}>Searching...</div>
          </div>
        ) : searchQuery ? (
          searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>No results found</h3>
              <p>No emails found for "{searchQuery}"</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {searchResults.map((mail, index) => (
                <div
                  key={mail._id || index}
                  style={{
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: mail.isRead ? '#fff' : '#f0f7ff'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span style={{
                          fontWeight: mail.isRead ? '500' : '700',
                          color: '#333',
                          fontSize: '16px'
                        }}>
                          {mail.sender?.name || mail.fromName || mail.from?.split('@')[0] || mail.from || 'Unknown Sender'}
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
                    <div style={{ textAlign: 'right', marginLeft: '20px' }}>
                      <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>
                        {new Date(mail.createdAt).toLocaleDateString()}
                      </div>
                      <div style={{ color: '#666', fontSize: '11px' }}>
                        {new Date(mail.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : recentMails.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>No emails yet</h3>
            <p>Your inbox is empty. Start by composing your first email!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentMails.map((mail, index) => (
              <div
                key={mail._id || index}
                style={{
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: mail.isRead ? '#fff' : '#f0f7ff'
                }}
                onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
                onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                onClick={() => {
                  setSelectedMail(mail);
                  setShowMailViewer(true);
                  if (!mail.isRead) {
                    handleMarkAsRead(mail._id);
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{
                        fontWeight: mail.isRead ? '500' : '700',
                        color: '#333',
                        fontSize: '16px'
                      }}>
                        {mail.sender?.name || mail.fromName || mail.from?.split('@')[0] || mail.from || 'Unknown Sender'}
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
                  <div style={{ textAlign: 'right', marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>
                        {new Date(mail.createdAt).toLocaleDateString()}
                      </div>
                      <div style={{ color: '#666', fontSize: '11px' }}>
                        {new Date(mail.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                      {!mail.isRead && !mail.read && (
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
                            fontSize: '11px',
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
                          fontSize: '11px',
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
            <ComposeForm onSend={handleCompose} onCancel={() => setShowCompose(false)} />
          </div>
        </div>
      )}
      
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

function ComposeForm({ onSend, onCancel }) {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    body: ''
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('ComposeForm handleSubmit called with:', formData);
    
    if (!formData.to || !formData.subject || !formData.body) {
      console.log('Form validation failed - missing fields');
      return;
    }
    
    setSending(true);
    try {
      console.log('Calling onSend with:', formData);
      await onSend(formData);
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="email"
          placeholder="To"
          value={formData.to}
          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
          required
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
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          required
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
            onClick={onCancel}
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
            type="submit"
            disabled={sending}
            onClick={() => console.log('Send button clicked, form data:', formData)}
            style={{
              padding: '10px 20px',
              background: sending ? '#ccc' : '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: sending ? 'not-allowed' : 'pointer'
            }}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}