import React from 'react';

const DirectReleaseTable = ({ data = [] }) => {
    return (
        <div style={cardStyle}>
            <h4 style={titleStyle}>2.0 STATUS OF DIRECT RELEASE (ENCODED BUDGET)</h4>
            <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={headerRow}>
                            <th style={thL}>Division</th>
                            <th style={thL}>Component</th>
                            <th style={th}>Allocation (ABC)</th>
                            <th style={th}>Obligated</th>
                            <th style={th}>Disbursement</th>
                            <th style={th}>% Utilization</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((r, i) => (
                            <tr key={i}>
                                <td style={tdL}>{r.division.toUpperCase()}</td>
                                <td style={tdL}>{r.component}</td>
                                <td style={td}>₱{Number(r.abc).toLocaleString()}</td>
                                <td style={td}>₱{Number(r.obligated).toLocaleString()}</td>
                                <td style={td}>₱{Number(r.disbursement).toLocaleString()}</td>
                                <td style={{ ...td, fontWeight: '900', color: '#1e3a8a' }}>
                                    {((r.disbursement / r.abc) * 100).toFixed(2)}%
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
const titleStyle = { margin: '0 0 15px 0', fontSize: '11px', fontWeight: '900', color: '#1e3a8a', borderLeft: '5px solid #1e3a8a', paddingLeft: '10px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '10px' };
const headerRow = { background: '#f8fafc', borderBottom: '2px solid #0f172a' };
const th = { padding: '10px', textAlign: 'right', fontWeight: '900' };
const thL = { ...th, textAlign: 'left' };
const td = { padding: '10px', textAlign: 'right', borderBottom: '1px solid #f1f5f9', fontWeight: '700' };
const tdL = { ...td, textAlign: 'left' };

export default DirectReleaseTable;