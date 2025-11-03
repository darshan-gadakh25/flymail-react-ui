import { useState, useEffect } from 'react';
import MailItem from './MailItem';

export default function MailList({ mails, onSelectMail, onDelete, refreshList }) {
  const [selectedMail, setSelectedMail] = useState(null);

  const handleSelect = (mail) => {
    setSelectedMail(mail);
    if (onSelectMail) {
      onSelectMail(mail);
    }
  };

  const handleDelete = async (mailId) => {
    try {
      await onDelete(mailId);
      if (refreshList) {
        refreshList();
      }
    } catch (error) {
      console.error('Failed to delete mail:', error);
    }
  };

  if (!mails || mails.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>No emails found</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {mails.map((mail) => (
        <MailItem
          key={mail._id}
          mail={mail}
          isSelected={selectedMail?._id === mail._id}
          onSelect={handleSelect}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  emptyState: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    color: '#666',
    fontSize: '16px',
  },
};

