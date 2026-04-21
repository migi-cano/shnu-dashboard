import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import SbfpMain from './components/SBFP/SbfpMain';
import MdnsDashboard from './components/MDNS/MdnsDashboard';
import WinsDashboard from './components/WINS/WinsDashboard';

function App() {
  const [activeProgram, setActiveProgram] = useState('SBFP');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div style={{
      display: 'grid',
      // 🚀 The grid handles the sliding animation
      gridTemplateColumns: isSidebarOpen ? '280px 1fr' : '0px 1fr',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      transition: 'grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
      backgroundColor: '#f8fafc'
    }}>

      {/* 1. SIDEBAR CONTAINER (The Guillotine) */}
      <div style={{ 
        overflow: 'hidden', 
        height: '100vh',
        backgroundColor: '#1e3a8a',
        borderRight: isSidebarOpen ? '1px solid #e2e8f0' : 'none',
      }}>
        <Sidebar 
          activeTab={activeProgram} 
          setActiveTab={setActiveProgram} 
          isOpen={isSidebarOpen} 
        />
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <main style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={headerStyle}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={toggleBtnStyle}>
            {isSidebarOpen ? '«' : '☰'}
          </button>
          <h2 style={{ margin: 0, fontSize: '14px', color: '#1e3a8a', fontWeight: '800' }}>
            ONE NCR HEALTH MANAGEMENT SYSTEM
          </h2>
        </header>

        <div style={{ flex: 1, width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeProgram === 'SBFP' && <SbfpMain />}
          {activeProgram === 'MDNS' && <MdnsDashboard />}
          {activeProgram === 'WINS' && <WinsDashboard />}
          
          {!['SBFP', 'MDNS', 'WINS'].includes(activeProgram) && (
            <div style={placeholderStyle}>
               <h3>{activeProgram} Module</h3>
               <p>Under Development</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const headerStyle = { height: '50px', padding: '0 20px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px', flexShrink: 0 };
const toggleBtnStyle = { background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', padding: '4px 8px', fontSize: '16px', color: '#1e3a8a' };
const placeholderStyle = { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8' };

export default App;