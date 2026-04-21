import React, { useState } from 'react';

const fontStack = '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif';

const SDO_LIST = [
    "Caloocan", "Las Piñas", "Makati", "Malabon", 
    "Mandaluyong", "Manila", "Marikina", "Muntinlupa", 
    "Navotas", "Parañaque", "Pasay", "Pasig", 
    "Quezon City", "San Juan", "Taguig", "Valenzuela"
];

const WinsAnalytics = ({ data }) => {
    const [activeTab, setActiveTab] = useState('Elementary');

    const filteredData = data.filter(item => item.level === activeTab);

    const groupedData = filteredData.reduce((acc, item) => {
        if (!acc[item.division]) acc[item.division] = [];
        acc[item.division].push(item);
        return acc;
    }, {});

    return (
        <div style={pageWrapper}>
            <div style={container}>
                <h3 style={sectionLabel}>WinS Regional Analytics</h3>

                <div style={tabContainer}>
                    {['Elementary', 'Secondary'].map(lvl => (
                        <button 
                            key={lvl}
                            onClick={() => setActiveTab(lvl)} 
                            style={activeTab === lvl ? tabActive : tabInactive}
                        >
                            {lvl} ({data.filter(d => d.level === lvl).length})
                        </button>
                    ))}
                </div>

                <div style={tableWrapper}>
                    <table style={mainTable}>
                        <thead>
                            <tr style={thRow}>
                                <th style={thL}>Division</th>
                                <th style={thL}>School Institution</th>
                                <th style={th}>Star Rating</th>
                                <th style={th}>Total Schools</th> {/* 🚀 NEW COLUMN */}
                            </tr>
                        </thead>
                        <tbody>
                            {SDO_LIST.map((division) => {
                                const schools = groupedData[division] || [];

                                // Scenario A: Division has no schools yet
                                if (schools.length === 0) {
                                    return (
                                        <tr key={division} style={divisionDivider}>
                                            <td style={divisionCell}>{division}</td>
                                            <td style={emptySchoolCell}>No schools encoded yet</td>
                                            <td style={td}>
                                                <div style={pendingBadge}>Pending</div>
                                            </td>
                                            <td style={totalCell}>0</td>
                                        </tr>
                                    );
                                }

                                // Scenario B: Division has multiple schools
                                return schools.map((school, index) => {
                                    const isLastInGroup = index === schools.length - 1;
                                    return (
                                        <tr 
                                            key={`${division}-${index}`} 
                                            style={isLastInGroup ? divisionDivider : trBorder}
                                        >
                                            {index === 0 ? (
                                                <>
                                                    <td style={divisionCell} rowSpan={schools.length}>
                                                        {division}
                                                    </td>
                                                </>
                                            ) : null}
                                            <td style={tdL}>{school.schoolName}</td>
                                            <td style={td}>
                                                <div style={getStarStyle(school.stars)}>
                                                    {school.stars === '0' ? 'Pending' : '★'.repeat(school.stars)}
                                                </div>
                                            </td>
                                            {/* 🚀 Render Total Count once per Division Group */}
                                            {index === 0 ? (
                                                <td style={totalCell} rowSpan={schools.length}>
                                                    {schools.length}
                                                </td>
                                            ) : null}
                                        </tr>
                                    );
                                });
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- STYLES ---

const totalCell = {
    padding: '14px 16px',
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    background: '#fcfcfc',
    borderLeft: '1px solid #f1f5f9',
    verticalAlign: 'middle'
};

const divisionDivider = { 
    borderBottom: '2px solid #cbd5e1' 
};

const trBorder = { 
    borderBottom: '1px solid #f1f5f9' 
};

const divisionCell = { 
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: '14px',
    background: '#f8fafc',
    fontWeight: '700', 
    borderRight: '1px solid #e2e8f0',
    verticalAlign: 'top',
    color: '#1e3a8a',
    width: '180px'
};

const getStarStyle = (stars) => ({
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
    background: stars === '3' ? '#f0fdf4' : stars === '0' ? '#fef2f2' : '#fffbeb',
    color: stars === '3' ? '#166534' : stars === '0' ? '#991b1b' : '#92400e',
    border: `1px solid ${stars === '3' ? '#bbf7d0' : stars === '0' ? '#fecaca' : '#fed7aa'}`,
});

const pageWrapper = { display: 'flex', justifyContent: 'center', fontFamily: fontStack, padding: '20px' };
const container = { background: '#fff', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '1000px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' };
const sectionLabel = { fontSize: '20px', color: '#334155', fontWeight: '600', marginBottom: '24px' };
const tabContainer = { display: 'flex', gap: '4px', marginBottom: '24px', background: '#f1f5f9', padding: '4px', borderRadius: '8px', width: 'fit-content' };
const tabBase = { padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500', fontFamily: fontStack, transition: 'all 0.2s' };
const tabActive = { ...tabBase, background: '#fff', color: '#1e40af', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const tabInactive = { ...tabBase, background: 'transparent', color: '#64748b' };
const tableWrapper = { border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' };
const mainTable = { width: '100%', borderCollapse: 'collapse' };
const thRow = { background: '#f8fafc' };
const th = { padding: '12px 16px', color: '#64748b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' };
const thL = { ...th, textAlign: 'left' };
const td = { padding: '14px 16px', fontSize: '14px', color: '#475569', textAlign: 'center' };
const tdL = { ...td, textAlign: 'left' };
const emptySchoolCell = { ...tdL, fontStyle: 'italic', color: '#94a3b8' };
const pendingBadge = { padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '500', background: '#f8fafc', color: '#94a3b8', border: '1px solid #e2e8f0', display: 'inline-block' };

export default WinsAnalytics;