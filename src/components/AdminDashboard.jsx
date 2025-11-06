import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from './Toast';
import * as adminService from '../services/adminService';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    inactiveUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userEmails, setUserEmails] = useState([]);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const response = await adminService.listUsers();
      const userData = response.data || response.users || [];
      setUsers(userData);

      const stats = {
        totalUsers: userData.length,
        activeUsers: userData.filter(u => (u.isActive !== false && u.status !== 'inactive')).length,
        adminUsers: userData.filter(u => u.role === 'admin').length,
        inactiveUsers: userData.filter(u => (u.isActive === false || u.status === 'inactive')).length
      };
      setStats(stats);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      const response = await adminService.toggleActive(userId);
      console.log('Toggle response:', response);
      
      // Update the user in the local state immediately
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user._id === userId) {
            const newStatus = response.user?.status === 'active';
            return { 
              ...user, 
              isActive: newStatus,
              status: response.user?.status 
            };
          }
          return user;
        })
      );
      
      const statusText = response.user?.status === 'active' ? 'activated' : 'deactivated';
      toast.success(`User ${statusText} successfully`);
      
      // Also reload data to ensure consistency
      setTimeout(() => loadAdminData(), 500);
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Can not update admin status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(userId);
        toast.success('User deleted successfully');
        loadAdminData();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleViewUserEmails = async (userId) => {
    try {
      console.log('Fetching emails for user:', userId);
      
      // Clear previous data first
      setUserEmails([]);
      setSelectedUser(null);
      
      const response = await adminService.viewUserMail(userId);
      console.log('Full API response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response || {}));
      
      let emails = [];
      
      if (response) {
        // Combine inbox and sent emails
        const inboxEmails = response.inbox?.mails || [];
        const sentEmails = response.sent?.mails || [];
        
        emails = [...inboxEmails, ...sentEmails];
        
        console.log('Inbox emails:', inboxEmails);
        console.log('Sent emails:', sentEmails);
        console.log('Combined emails:', emails);
      }
      
      console.log('Final emails array:', emails);
      console.log('Emails length:', emails.length);
      
      // Force state update
      const selectedUserData = users.find(u => u._id === userId);
      console.log('Selected user:', selectedUserData);
      
      // Set state with a small delay to ensure proper rendering
      setTimeout(() => {
        setUserEmails([...emails]); // Create new array reference
        setSelectedUser(selectedUserData);
      }, 100);
      
      if (emails.length === 0) {
        toast.info('No emails found for this user');
      } else {
        toast.success(`Found ${emails.length} emails`);
      }
    } catch (error) {
      console.error('Error loading user emails:', error);
      toast.error(error.response?.data?.message || 'Failed to load user emails');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="padding-mobile" style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 className="title-mobile" style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
          Admin Dashboard 👑
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Manage users and monitor system activity</p>
      </div>

      {/* Admin Stats */}
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
            <div style={{ fontSize: '32px' }}>👥</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{stats.totalUsers}</h3>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Total Users</p>
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
            <div style={{ fontSize: '32px' }}>✅</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{stats.activeUsers}</h3>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Active Users</p>
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
            <div style={{ fontSize: '32px' }}>👑</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{stats.adminUsers}</h3>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Admin Users</p>
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
            <div style={{ fontSize: '32px' }}>❌</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{stats.inactiveUsers}</h3>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Inactive Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        marginBottom: '30px'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: 0 }}>
            User Management
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>User</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Email</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Role</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Joined</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userData, index) => (
                <tr key={userData._id} style={{ borderBottom: index < users.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: userData.role === 'admin' ? '#ef4444' : '#10b981',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}>
                        {userData.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#333' }}>{userData.name}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>ID: {userData._id?.slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '15px', color: '#666' }}>{userData.email}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      background: userData.role === 'admin' ? '#ef4444' : '#10b981',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {userData.role}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      background: (userData.isActive !== false && userData.status !== 'inactive') ? '#10b981' : '#ef4444',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {(userData.isActive !== false && userData.status !== 'inactive') ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '15px', color: '#666', fontSize: '14px' }}>
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                      <button
                        onClick={() => handleViewUserEmails(userData._id)}
                        style={{
                          padding: '6px 12px',
                          background: '#22c55e',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        View Emails
                      </button>
                      <button
                        onClick={() => handleToggleActive(userData._id)}
                        style={{
                          padding: '6px 12px',
                          background: (userData.isActive !== false && userData.status !== 'inactive') ? '#f59e0b' : '#10b981',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {(userData.isActive !== false && userData.status !== 'inactive') ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(userData._id)}
                        style={{
                          padding: '6px 12px',
                          background: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>No users found</h3>
            <p>No users have registered yet.</p>
          </div>
        )}
      </div>

      {/* User Emails Modal */}
      {selectedUser && (
        <div 
          key={selectedUser._id} 
          style={{
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
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8f9fa'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#333' }}>
                  📧 {selectedUser.name}'s Emails
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>
                  {userEmails.length} {userEmails.length === 1 ? 'email' : 'emails'} found
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setUserEmails([]);
                }}
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Close
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px', padding: '10px', background: '#f0f7ff', borderRadius: '6px', fontSize: '12px', color: '#666' }}>
                Debug: {userEmails.length} emails loaded for {selectedUser.name}
              </div>
              {userEmails.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
                  <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>No emails found</h3>
                  <p>This user hasn't sent or received any emails yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                  {userEmails.map((email, index) => (
                    <div
                      key={email._id || email.id || index}
                      style={{
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        background: (email.isRead || email.read) ? '#fff' : '#f0f7ff'
                      }}
                    >
                      <div className="flex-responsive" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: '600', color: '#10b981', fontSize: '14px' }}>
                              From: {email.sender?.name || email.sender?.email || email.from || 'Unknown'}
                            </span>
                            <span style={{ fontWeight: '600', color: '#10b981', fontSize: '14px' }}>
                              To: {email.receiver?.name || email.receiver?.email || email.to || 'Unknown'}
                            </span>
                            {!(email.isRead || email.read) && (
                              <span style={{
                                width: '8px',
                                height: '8px',
                                background: '#ef4444',
                                borderRadius: '50%',
                                flexShrink: 0
                              }} />
                            )}
                          </div>
                          <h4 style={{
                            margin: '0 0 8px 0',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#333',
                            wordBreak: 'break-word'
                          }}>
                            {email.subject || email.title || 'No Subject'}
                          </h4>
                          <p style={{
                            margin: 0,
                            color: '#666',
                            fontSize: '14px',
                            lineHeight: '1.4',
                            wordBreak: 'break-word'
                          }}>
                            {(email.body || email.content || email.message || 'No content')?.substring(0, 200)}
                            {(email.body || email.content || email.message || '').length > 200 ? '...' : ''}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>
                            {new Date(email.createdAt || email.date || email.timestamp || Date.now()).toLocaleDateString()}
                          </div>
                          <div style={{ color: '#666', fontSize: '11px' }}>
                            {new Date(email.createdAt || email.date || email.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div style={{ 
                            marginTop: '8px',
                            padding: '2px 6px',
                            background: (email.isRead || email.read) ? '#10b981' : '#ef4444',
                            color: '#fff',
                            fontSize: '10px',
                            borderRadius: '4px',
                            textAlign: 'center'
                          }}>
                            {(email.isRead || email.read) ? 'Read' : 'Unread'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}