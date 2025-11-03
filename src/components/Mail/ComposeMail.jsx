import { useState } from 'react';
import * as mailService from '../../services/mailService';

export default function ComposeMail({ onClose, draftMail = null, onSent }) {
  const [formData, setFormData] = useState({
    toEmail: draftMail?.toEmail || '',
    subject: draftMail?.subject || '',
    body: draftMail?.body || '',
    isDraft: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const mailData = {
        ...formData,
        isDraft: true,
      };
      
      await mailService.composeMail(mailData);
      setMessage('Draft saved successfully!');
      
      setTimeout(() => {
        if (onClose) onClose();
        if (onSent) onSent();
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!formData.toEmail || !formData.subject || !formData.body) {
      setMessage('Please fill in all fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const mailData = {
        ...formData,
        isDraft: false,
      };
      
      await mailService.composeMail(mailData);
      setMessage('Email sent successfully!');
      
      setTimeout(() => {
        if (onClose) onClose();
        if (onSent) onSent();
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2>New Message</h2>
          <button onClick={onClose} style={styles.closeButton}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSend} style={styles.form}>
          <input
            type="email"
            name="toEmail"
            placeholder="To"
            value={formData.toEmail}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <textarea
            name="body"
            placeholder="Message"
            value={formData.body}
            onChange={handleChange}
            style={styles.textarea}
            rows="12"
            required
          />

          {message && (
            <div
              style={{
                ...styles.message,
                color: message.includes('success') ? '#28a745' : '#d63384',
              }}
            >
              {message}
            </div>
          )}

          <div style={styles.actions}>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={loading || (!formData.toEmail && !formData.subject && !formData.body)}
              style={{
                ...styles.draftButton,
                opacity: loading || (!formData.toEmail && !formData.subject && !formData.body) ? 0.5 : 1,
              }}
            >
              {loading ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.sendButton,
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e0e0e0',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
  },
  form: {
    padding: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  draftButton: {
    padding: '10px 20px',
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  sendButton: {
    padding: '10px 20px',
    background: '#0b6efd',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  message: {
    marginBottom: '10px',
    fontSize: '14px',
    fontWeight: '500',
  },
};

