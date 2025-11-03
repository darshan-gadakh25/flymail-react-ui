import { useState } from 'react';
import * as mailService from '../../services/mailService';

export default function MailItem({ mail, isSelected, onSelect, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this email?')) {
      setIsDeleting(true);
      try {
        await onDelete(mail._id);
      } catch (error) {
        console.error('Failed to delete:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleClick = async () => {
    if (!mail.isRead && mail.status !== 'sent') {
      try {
        await mailService.markAsRead(mail._id);
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
    onSelect(mail);
  };

  const getTruncatedBody = (body) => {
    if (!body) return 'No content';
    return body.length > 100 ? body.substring(0, 100) + '...' : body;
  };

  const getDisplayName = (mail) => {
    if (mail.from) {
      return mail.from.name || mail.from.email;
    }
    if (mail.to) {
      return mail.to.email;
    }
    return 'Unknown';
  };

  return (
    <div
      style={{
        ...styles.item,
        ...(isSelected ? styles.itemSelected : {}),
        ...(!mail.isRead && mail.status !== 'sent' ? styles.unread : {}),
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <div style={styles.header}>
        <div style={styles.from}>
          {mail.status === 'sent' ? 'To: ' : 'From: '}
          {getDisplayName(mail)}
        </div>
        <div style={styles.date}>
          {new Date(mail.createdAt).toLocaleDateString()}
        </div>
      </div>
      <div style={styles.subject}>{mail.subject}</div>
      <div style={styles.body}>{getTruncatedBody(mail.body)}</div>
      {!isDeleting && (
        <button
          style={styles.deleteButton}
          onClick={handleDelete}
          title="Delete"
        >
          🗑️
        </button>
      )}
      {isDeleting && <span style={styles.deleting}>Deleting...</span>}
      {!mail.isRead && mail.status !== 'sent' && (
        <span style={styles.unreadBadge}>New</span>
      )}
    </div>
  );
}

const styles = {
  item: {
    padding: '15px',
    borderBottom: '1px solid #e0e0e0',
    position: 'relative',
    transition: 'background 0.2s',
    backgroundColor: '#fff',
  },
  itemSelected: {
    backgroundColor: '#e3f2fd',
  },
  unread: {
    backgroundColor: '#f0f8ff',
    fontWeight: '600',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  from: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: '12px',
    color: '#666',
  },
  subject: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '5px',
    color: '#333',
  },
  body: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
  },
  deleteButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '5px',
  },
  deleting: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '12px',
    color: '#666',
  },
  unreadBadge: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    background: '#0b6efd',
    color: 'white',
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '10px',
    fontWeight: '600',
  },
};

