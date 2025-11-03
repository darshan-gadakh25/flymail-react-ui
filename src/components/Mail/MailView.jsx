import { useState, useEffect } from 'react';
import * as mailService from '../../services/mailService';

export default function MailView({ mail, onClose, onDelete }) {
  const [fullMail, setFullMail] = useState(mail);

  useEffect(() => {
    if (mail && !fullMail.body) {
      // Fetch full mail details if needed
      mailService
        .getMailById(mail._id)
        .then((data) => setFullMail(data))
        .catch((error) => console.error('Failed to fetch mail:', error));
    }
  }, [mail]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this email?')) {
      try {
        await onDelete(mail._id);
        if (onClose) {
          onClose();
        }
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  if (!fullMail) {
    return (
      <div style={styles.container}>
        <p>No mail selected</p>
      </div>
    );
  }

  const getDisplayName = (mailData) => {
    if (mailData.from) {
      return mailData.from.name || mailData.from.email;
    }
    if (mailData.to) {
      return mailData.to.email;
    }
    return 'Unknown';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.subject}>{fullMail.subject}</h2>
        <div style={styles.actions}>
          <button onClick={onClose} style={styles.closeButton}>
            ✕
          </button>
        </div>
      </div>
      
      <div style={styles.meta}>
        <div>
          <strong>{fullMail.status === 'sent' ? 'To: ' : 'From: '}</strong>
          {getDisplayName(fullMail)}
        </div>
        <div style={styles.date}>
          {new Date(fullMail.createdAt).toLocaleString()}
        </div>
      </div>

      <div style={styles.body}>{fullMail.body || 'No content'}</div>

      <div style={styles.footer}>
        <button onClick={handleDelete} style={styles.deleteButton}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#fff',
    height: '100%',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '15px',
  },
  subject: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
  },
  meta: {
    marginBottom: '20px',
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.8',
  },
  date: {
    marginTop: '5px',
    color: '#999',
  },
  body: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#333',
    whiteSpace: 'pre-wrap',
    marginBottom: '30px',
  },
  footer: {
    borderTop: '1px solid #e0e0e0',
    paddingTop: '15px',
  },
  deleteButton: {
    padding: '10px 20px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

