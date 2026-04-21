import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import WinsEntry from './WinsEntry';
import WinsAnalytics from './WinsAnalytics';

const WinsDashboard = () => {
    const [view, setView] = useState('input');
    const [winsData, setWinsData] = useState([]);

    const fetchWinsData = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/wins');
            setWinsData(Array.isArray(res.data) ? res.data : []);
        } catch (err) { 
            console.error("Fetch Error:", err); 
            setWinsData([]); 
        }
    }, []);

    useEffect(() => { fetchWinsData(); }, [fetchWinsData]);

    return (
        <div style={dashboardWrapper}>
            {/* MODERN GLASS HEADER */}
            <div style={headerGlass}>
                <div style={titleGroup}>
                    <div style={iconBox}>💧</div>
                    <div>
                        <h2 style={mainTitle}>WinS Monitoring System</h2>
                        <p style={subTitle}>Wash in Schools • Regional Data Management</p>
                    </div>
                </div>
                <div style={navGroup}>
                    <button onClick={() => setView('input')} style={view === 'input' ? activeTab : inactiveTab}>
                        ENCODE SCHOOL
                    </button>
                    <button onClick={() => setView('analytics')} style={view === 'analytics' ? activeTab : inactiveTab}>
                        ANALYTICS
                    </button>
                </div>
            </div>

            <div className="custom-scroll" style={contentArea}>
                {view === 'input' ? (
                    <WinsEntry onSave={fetchWinsData} />
                ) : (
                    <WinsAnalytics data={winsData} />
                )}
            </div>
        </div>
    );
};

// --- STYLES ---
const dashboardWrapper = { height: '100%', display: 'flex', flexDirection: 'column', background: '#f0f4f8', overflow: 'hidden' };
const headerGlass = { padding: '20px 40px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #d1d5db', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 };
const titleGroup = { display: 'flex', alignItems: 'center', gap: '15px' };
const iconBox = { fontSize: '24px', background: '#e0f2fe', padding: '10px', borderRadius: '12px' };
const mainTitle = { margin: 0, fontSize: '20px', color: '#1e3a8a', fontWeight: '900', letterSpacing: '-0.5px' };
const subTitle = { margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '600' };
const navGroup = { display: 'flex', background: '#f1f5f9', padding: '5px', borderRadius: '12px' };
const tabBase = { padding: '10px 25px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '11px', fontWeight: '800', transition: 'all 0.3s ease' };
const activeTab = { ...tabBase, background: '#1e3a8a', color: '#fff', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)' };
const inactiveTab = { ...tabBase, background: 'transparent', color: '#64748b' };
const contentArea = { flex: 1, overflowY: 'auto', padding: '30px' };

export default WinsDashboard;