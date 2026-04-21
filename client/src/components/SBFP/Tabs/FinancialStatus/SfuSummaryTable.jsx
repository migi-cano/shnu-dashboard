import React from 'react';

const SfuSummaryTable = ({ data }) => {
    return (
        <div style={cardStyle}>
            <div style={header}>FY 2025 STATUS OF FUND UTILIZATION</div>
            <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={thRow1}>
                            <th colSpan="2" style={th}>APPROVED BUDGET COST</th>
                            <th rowSpan="2" style={th}>ACTUAL CONTRACT</th>
                            <th rowSpan="2" style={th}>VARIANCE</th>
                            <th rowSpan="2" style={th}>OBLIGATED AMOUNT</th>
                            <th rowSpan="2" style={th}>% OBLIGATION</th>
                            <th rowSpan="2" style={th}>DISBURSEMENT</th>
                            <th rowSpan="2" style={th}>% DISBURSEMENT</th>
                            <th rowSpan="2" style={th}>LIQUIDATED AMOUNT</th>
                            <th rowSpan="2" style={th}>REMARKS</th>
                        </tr>
                        <tr style={thRow2}>
                            <th style={th}>DIVISION / ITEMS</th>
                            <th style={th}>AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((r, i) => {
                            const variance = Number(r.abc) - Number(r.actualContract);
                            const percObligation = (Number(r.obligated) / Number(r.abc)) * 100;
                            const percDisbursement = (Number(r.disbursement) / Number(r.obligated)) * 100;

                            return (
                                <tr key={i} style={rowStyle}>
                                    <td style={tdL}>{r.division.toUpperCase()} - {r.item}</td>
                                    <td style={td}>₱{Number(r.abc).toLocaleString()}</td>
                                    <td style={td}>₱{Number(r.actualContract).toLocaleString()}</td>
                                    <td style={{ ...td, color: '#ef4444' }}>₱{variance.toLocaleString()}</td>
                                    <td style={td}>₱{Number(r.obligated).toLocaleString()}</td>
                                    <td style={{ ...td, fontWeight: '900' }}>{percObligation.toFixed(2)}%</td>
                                    <td style={td}>₱{Number(r.disbursement).toLocaleString()}</td>
                                    <td style={{ ...td, color: '#16a34a' }}>{percDisbursement.toFixed(2)}%</td>
                                    <td style={td}>₱{Number(r.liquidated || 0).toLocaleString()}</td>
                                    <td style={{ ...td, textAlign: 'left', fontSize: '9px' }}>{r.remarks}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const cardStyle = { background: '#fff', border: '1px solid #cbd5e1' };
const header = { background: '#7c2d12', color: '#fff', textAlign: 'center', padding: '10px', fontWeight: '900', fontSize: '14px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '10px' };
const thRow1 = { background: '#fed7aa' };
const thRow2 = { background: '#ffedd5' };
const th = { border: '1px solid #0f172a', padding: '8px', color: '#0f172a', fontWeight: '900' };
const td = { border: '1px solid #cbd5e1', padding: '8px', textAlign: 'right', color: '#0f172a', fontWeight: '700' };
const tdL = { ...td, textAlign: 'left', fontWeight: '800', background: '#f8fafc' };
const rowStyle = { borderBottom: '1px solid #cbd5e1' };

export default SfuSummaryTable;