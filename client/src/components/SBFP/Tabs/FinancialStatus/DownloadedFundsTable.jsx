import React from 'react';

const DownloadedFundsTable = ({ financialData = [] }) => {
    // 💡 In a real app, 'financialData' would be fetched from your DB 
    // where you stored the PSF/CoS inputs per division.
    
    return (
        <div style={cardStyle}>
            <h4 style={titleStyle}>1.0 STATUS OF DOWNLOADED FUNDS (ADMINISTRATIVE)</h4>
            <div className="custom-scroll" style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={headerRow}>
                            <th style={thL}>Division</th>
                            <th style={thL}>Component</th>
                            <th style={th}>ABC</th>
                            <th style={th}>Obligated</th>
                            <th style={th}>Disbursed</th>
                            <th style={th}>% Utilization</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Mocking encoded data for demonstration */}
                        {[
                            { div: 'Manila', comp: 'PSF', abc: 500000, obl: 450000, dis: 120000 },
                            { div: 'Quezon City', comp: 'PSF', abc: 750000, obl: 700000, dis: 300000 }
                        ].map((r, i) => (
                            <tr key={i}>
                                <td style={tdL}>{r.div.toUpperCase()}</td>
                                <td style={tdL}>{r.comp}</td>
                                <td style={td}>₱{r.abc.toLocaleString()}</td>
                                <td style={td}>₱{r.obl.toLocaleString()}</td>
                                <td style={td}>₱{r.dis.toLocaleString()}</td>
                                <td style={{ ...td, color: '#1e3a8a', fontWeight: '900' }}>
                                    {((r.dis / r.abc) * 100).toFixed(2)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const cardStyle = { background: '#fff', borderRadius: '12px', padding: '24px', border: '2px solid #cbd5e1' };
const titleStyle = { margin: '0 0 15px 0', fontSize: '11px', fontWeight: '900', color: '#7c2d12', borderLeft: '5px solid #7c2d12', paddingLeft: '10px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '10px' };
const headerRow = { background: '#f8fafc', borderBottom: '2px solid #0f172a' };
const th = { padding: '10px', textAlign: 'right', fontWeight: '900', color: '#0f172a' };
const thL = { ...th, textAlign: 'left' };
const td = { padding: '10px', textAlign: 'right', borderBottom: '1px solid #f1f5f9', color: '#0f172a', fontWeight: '700' };
const tdL = { ...td, textAlign: 'left', fontWeight: '800' };

export default DownloadedFundsTable;