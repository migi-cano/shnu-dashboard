import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MdnsEntry from './MdnsEntry';
import MdnsAnalytics from './MdnsAnalytics';

const MdnsDashboard = () => {
    const [view, setView] = useState('input');
    const [activeTab, setActiveTab] = useState('1.1');
    const [allData, setAllData] = useState([]);
    const [selectedDivision, setSelectedDivision] = useState('OVERALL'); // Moved state here to align with tabs

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/mdns');
            setAllData(res.data.filter(item => item.reportType === activeTab));
        } catch (err) { console.error("Fetch Error:", err); }
    }, [activeTab]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
            
            {/* TOP BAR */}
            <div style={headerSection}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: '900' }}>MEDICAL & DENTAL UNIT (MDNS)</h2>
                    <p style={{ margin: 0, fontSize: '11px', color: '#334155', fontWeight: '800' }}>SDHCP Master Management System • Regional Health</p>
                </div>
                <div style={toggleBox}>
                    <button onClick={() => setView('input')} style={{ ...toggleBtn, background: view === 'input' ? '#0f172a' : 'transparent', color: view === 'input' ? '#fff' : '#0f172a' }}>📝 ENTRY</button>
                    <button onClick={() => setView('analytics')} style={{ ...toggleBtn, background: view === 'analytics' ? '#0f172a' : 'transparent', color: view === 'analytics' ? '#fff' : '#0f172a' }}>📊 ANALYTICS</button>
                </div>
            </div>

            {/* 🚀 ALIGNED NAVIGATION ROW */}
            <div style={{ padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {['1.1', '1.2', '1.3', 'RO'].map(t => (
                        <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '10px 20px', borderRadius: '8px', border: activeTab === t ? 'none' : '2px solid #cbd5e1', background: activeTab === t ? '#1e3a8a' : '#fff', color: activeTab === t ? '#fff' : '#0f172a', fontWeight: '900', fontSize: '11px', cursor: 'pointer' }}>
                            FORM {t}
                        </button>
                    ))}
                </div>

                {/* 🚀 FOCUS SELECTOR ALIGNED WITH FORMS */}
                {view === 'analytics' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', padding: '5px 15px', borderRadius: '10px', border: '2px solid #cbd5e1' }}>
                        <span style={{ fontSize: '10px', fontWeight: '900', color: '#1e3a8a', textTransform: 'uppercase' }}>Focused View:</span>
                        <select 
                            value={selectedDivision} 
                            onChange={(e) => setSelectedDivision(e.target.value)} 
                            style={selectorStyle}
                        >
                            <option value="OVERALL">REGIONAL OVERALL (NCR)</option>
                            {["Caloocan", "Las Piñas", "Makati", "Malabon", "Mandaluyong", "Manila", "Marikina", "Muntinlupa", "Navotas", "Parañaque", "Pasay", "Pasig", "Quezon City", "San Juan", "Taguig", "Valenzuela"].map(d => (
                                <option key={d} value={d}>{d.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 25px 25px' }}>
                {view === 'input' ? (
                    <MdnsEntry activeTab={activeTab} refreshData={fetchData} />
                ) : (
                    <MdnsAnalytics activeTab={activeTab} allData={allData} selectedDivision={selectedDivision} />
                )}
            </div>

            <style>{`.custom-scroll::-webkit-scrollbar { width: 8px; } .custom-scroll::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 10px; } .custom-scroll::-webkit-scrollbar-track { background: #e2e8f0; }`}</style>
        </div>
    );
};

const selectorStyle = { border: 'none', fontSize: '11px', fontWeight: '900', color: '#0f172a', background: 'transparent', cursor: 'pointer', outline: 'none' };
const headerSection = { padding: '20px 25px', background: '#fff', borderBottom: '2px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const toggleBox = { display: 'flex', background: '#e2e8f0', padding: '5px', borderRadius: '10px' };
const toggleBtn = { padding: '8px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '900', transition: 'all 0.2s' };

export default MdnsDashboard;