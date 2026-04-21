import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, isOpen }) => {
  const menuItems = [
    { id: 'SBFP', label: 'Feeding Program (SBFP)'},
    { id: 'MDNS', label: 'Dental/Medical (MDNS)'},
    { id: 'SMHP', label: 'Mental Health (SMHP)'},
    { id: 'NDEP', label: 'Drug Education (NDEP)' },
    { id: 'WINS', label: 'Wash in Schools (WinS)'},
    { id: 'ARH', label: 'Adolescent Health (ARH)'},
  ];

  return (
    <div style={{
      width: '280px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      opacity: isOpen ? 1 : 0, 
      transition: 'opacity 0.2s ease',
      backgroundColor: '#1e3a8a', // Ensure background color is set for the container
    }}>
      
      {/* LOGO - Fixed at Top */}
      <div style={{ padding: '25px 20px', background: '#ffffff', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <img src="/ncrlogo.png" alt="Logo" style={{ height: '80px', objectFit: 'contain' }} />
      </div>

      <div style={{ padding: '15px 20px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
        <p style={{ margin: 0, fontSize: '10px', color: '#bfdbfe', letterSpacing: '2px', fontWeight: '800' }}>
          HEALTH UNIT DASHBOARD
        </p>
      </div>

      {/* NAV - SCROLLABLE AREA */}
      <nav 
        className="custom-sidebar-scroll"
        style={{ 
          flex: 1, 
          padding: '20px 15px', 
          overflowY: 'auto', // 🚀 Enables vertical scrolling
          maxHeight: 'calc(100vh - 160px)' // Ensures it fits within viewport
        }}
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              width: '100%',
              display: 'flex',
              padding: '14px 18px',
              marginBottom: '10px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: activeTab === item.id ? '#ffffff' : 'transparent',
              color: activeTab === item.id ? '#1e3a8a' : '#bfdbfe',
              textAlign: 'left',
              whiteSpace: 'nowrap',
              fontWeight: '700',
              transition: 'background 0.2s ease'
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* OPTIONAL CSS FOR THIN SCROLLBAR */}
      <style>{`
        .custom-sidebar-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;