import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f4f7fb' }}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div 
        className="layout-main"
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          marginLeft: sidebarOpen ? '280px' : '0',
          transition: 'margin-left 0.3s ease'
        }}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main style={{ flex: 1, overflow: 'auto' }}>
          {React.cloneElement(children, { activeSection, onSectionChange: setActiveSection })}
        </main>
      </div>
    </div>
  );
}