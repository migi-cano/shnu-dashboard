import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SupplierForm from './SupplierForm';
import SupplierViewStatement from './SupplierViewStatement';
import SupplierEditPayments from './SupplierEditPayments';

const DIVISIONS = ["Caloocan", "Las Piñas", "Makati", "Malabon", "Mandaluyong", "Manila", "Marikina", "Muntinlupa", "Navotas", "Parañaque", "Pasay", "Pasig", "Quezon City", "San Juan", "Taguig", "Valenzuela"];

const SupplierTracker = () => {
    const [showForm, setShowForm] = useState(false);
    const [showView, setShowView] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedDO, setSelectedDO] = useState(null);
    const [loading, setLoading] = useState(true);

    const [data, setData] = useState(DIVISIONS.map(div => ({
        division: div, 
        nfp: [], 
        milk: [], 
        sl: { amount: 0, status: 'Pending' }
    })));

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/suppliers');
                if (res.data && res.data.length > 0) {
                    const mergedData = DIVISIONS.map(divName => {
                        const existing = res.data.find(d => d.division.toLowerCase() === divName.toLowerCase());
                        return existing || { division: divName, nfp: [], milk: [], sl: { amount: 0, status: 'Pending' } };
                    });
                    setData(mergedData);
                }
            } catch (err) {
                console.error("Database connection failed:", err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    // --- FINANCIAL HELPERS ---
    const sumArray = (arr, field) => arr.reduce((acc, curr) => acc + (curr[field] || 0), 0);
    const getPerc = (cum, con) => (con > 0 ? ((cum / con) * 100).toFixed(1) : "0.0");

    // --- TOTALS ---
    const nfpConTotal = data.reduce((a, r) => a + sumArray(r.nfp, 'contract'), 0);
    const nfpPaidTotal = data.reduce((a, r) => a + sumArray(r.nfp, 'cumulative'), 0);
    const milkConTotal = data.reduce((a, r) => a + sumArray(r.milk, 'contract'), 0);
    const milkPaidTotal = data.reduce((a, r) => a + sumArray(r.milk, 'cumulative'), 0);
    const slTotal = data.reduce((a, r) => a + (r.sl?.amount || 0), 0);

    if (loading) return <div style={{padding: '20px', textAlign: 'center', fontWeight: '800'}}>Connecting to Regional Ledger...</div>;

    return (
        <div className="custom-scroll" style={mainWrapper}>
            
            {/* 💡 UPDATED BUTTON TEXT: NEW ENTRY */}
            <div style={headerContainer}>
                <div>
                    <h2 style={{ margin: 0, color: '#1e3a8a', fontSize: '20px', fontWeight: '900' }}>Supplier Payment Tracker</h2>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Regional Procurement & Financial Ledger • FY 2026</p>
                </div>
                <button onClick={() => setShowForm(true)} style={mainBtn}>+ NEW ENTRY</button>
            </div>

            {/* DASHBOARD */}
            <div style={dashboardGrid}>
                <div style={{ ...statCard, borderLeft: '4px solid #7c2d12', background: '#fff9f2' }}>
                    <span style={{ ...statLabel, color: '#9a3412' }}>OVERALL NFP</span>
                    <div style={{ ...statValue, color: '#7c2d12' }}>₱{nfpConTotal.toLocaleString()}</div>
                    <div style={statSub}>{getPerc(nfpPaidTotal, nfpConTotal)}% Utilized</div>
                </div>
                <div style={{ ...statCard, borderLeft: '4px solid #f59e0b', background: '#fffbeb' }}>
                    <span style={{ ...statLabel, color: '#b45309' }}>SCHOOL-LEVEL (HM)</span>
                    <div style={{ ...statValue, color: '#b45309' }}>₱{slTotal.toLocaleString()}</div>
                    <div style={statSub}>Regional Allotment</div>
                </div>
                <div style={{ ...statCard, borderLeft: '4px solid #1e40af', background: '#eff6ff' }}>
                    <span style={{ ...statLabel, color: '#1d4ed8' }}>OVERALL MILK</span>
                    <div style={{ ...statValue, color: '#1e40af' }}>₱{milkConTotal.toLocaleString()}</div>
                    <div style={statSub}>{getPerc(milkPaidTotal, milkConTotal)}% Utilized</div>
                </div>
                <div style={{ ...statCard, background: '#1e3a8a', border: 'none' }}>
                    <span style={{ ...statLabel, color: '#bfdbfe' }}>TOTAL PROGRAM BUDGET</span>
                    <div style={{ color: '#fff', fontSize: '16px', fontWeight: '900', marginTop: '5px' }}>
                        ₱{(nfpConTotal + milkConTotal + slTotal).toLocaleString()}
                    </div>
                    <div style={{ color: '#93c5fd', fontSize: '9px' }}>Combined Regional Scope</div>
                </div>
            </div>

            {/* TABLE */}
            <div style={tableWrapper}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8.5px', tableLayout: 'fixed' }}>
                    <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                        <tr style={{ background: '#7c2d12', color: '#fff' }}>
                            <th rowSpan={2} style={{ ...thStyle, width: '90px', borderRight: '1px solid #9a3412' }}>DIVISION</th>
                            <th colSpan={4} style={{ ...thStyle, textAlign: 'center', borderRight: '1px solid #9a3412' }}>NFP (CATERING)</th>
                            <th colSpan={2} style={{ ...thStyle, textAlign: 'center', borderRight: '1px solid #9a3412' }}>SCHOOL-LEVEL</th>
                            <th colSpan={4} style={{ ...thStyle, textAlign: 'center', borderRight: '1px solid #9a3412' }}>MILK COMPONENT</th>
                            <th rowSpan={2} style={{ ...thStyle, width: '120px', textAlign: 'center' }}>ACTIONS</th>
                        </tr>
                        <tr style={{ background: '#8c3310', color: '#fff', borderBottom: '2px solid #7c2d12' }}>
                            <th style={subTh}>Payees</th><th style={subTh}>Contract Amt</th><th style={subTh}>Total (Cum.)</th><th style={{ ...subTh, borderRight: '1px solid #9a3412' }}>%</th>
                            <th style={subTh}>Amount</th><th style={{ ...subTh, borderRight: '1px solid #9a3412' }}>Status</th>
                            <th style={subTh}>Payees</th><th style={subTh}>Contract Amt</th><th style={subTh}>Total (Cum.)</th><th style={{ ...subTh, borderRight: '1px solid #9a3412' }}>%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => {
                            const nC = sumArray(row.nfp, 'contract');
                            const nT = sumArray(row.nfp, 'cumulative');
                            const mC = sumArray(row.milk, 'contract');
                            const mT = sumArray(row.milk, 'cumulative');

                            return (
                                <tr key={row.division} style={trStyle}>
                                    <td style={divCol}>{row.division.toUpperCase()}</td>
                                    <td style={tdStyle}>{row.nfp.length > 0 ? <span style={countBadge}>{row.nfp.length}</span> : "---"}</td>
                                    <td style={tdStyle}>₱{nC.toLocaleString()}</td>
                                    <td style={tdStyle}>₱{nT.toLocaleString()}</td>
                                    <td style={{ ...tdStyle, fontWeight: '800', borderRight: '1px solid #f1f5f9' }}>{getPerc(nT, nC)}%</td>
                                    <td style={tdStyle}>₱{row.sl?.amount?.toLocaleString() || 0}</td>
                                    <td style={{ ...tdStyle, color: '#16a34a', fontWeight: '800', borderRight: '1px solid #f1f5f9' }}>{row.sl?.status}</td>
                                    <td style={tdStyle}>{row.milk.length > 0 ? <span style={{...countBadge, background:'#dbeafe', color:'#1e40af'}}>{row.milk.length}</span> : "---"}</td>
                                    <td style={tdStyle}>₱{mC.toLocaleString()}</td>
                                    <td style={tdStyle}>₱{mT.toLocaleString()}</td>
                                    <td style={{ ...tdStyle, fontWeight: '800', borderRight: '1px solid #f1f5f9' }}>{getPerc(mT, mC)}%</td>
                                    <td style={{ textAlign: 'center', padding: '5px' }}>
                                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                            <button onClick={() => { setSelectedDO(row); setShowView(true); }} style={vBtn}>VIEW</button>
                                            <button onClick={() => { setSelectedDO(row); setShowEdit(true); }} style={eBtn}>UPDATE</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* OVERLAYS */}
            {showForm && <SupplierForm divisions={DIVISIONS} data={data} setData={setData} onClose={() => setShowForm(false)} />}
            {showView && <SupplierViewStatement selectedDO={selectedDO} onClose={() => setShowView(false)} />}
            {showEdit && <SupplierEditPayments selectedDO={selectedDO} data={data} setData={setData} onClose={() => setShowEdit(false)} />}

            <style>{`.custom-scroll::-webkit-scrollbar { width: 6px; } .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }`}</style>
        </div>
    );
};

// --- STYLES ---
const mainWrapper = { display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflowY: 'auto', padding: '0 10px 20px 5px' };
const headerContainer = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', flexShrink: 0 };
const dashboardGrid = { display: 'flex', gap: '10px', marginBottom: '20px', flexShrink: 0 };
const statCard = { flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' };
const statLabel = { fontSize: '8px', fontWeight: '900', letterSpacing: '0.5px' };
const statValue = { fontSize: '16px', fontWeight: '900', marginTop: '4px' };
const statSub = { fontSize: '8px', fontWeight: '600', color: '#64748b' };
const mainBtn = { padding: '10px 20px', background: '#7c2d12', color: '#fff', border: 'none', borderRadius: '8px', marginRight: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '10px' };
const tableWrapper = { background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const thStyle = { padding: '8px 4px', color: '#fff', fontWeight: '900' };
const subTh = { padding: '5px 2px', fontSize: '7.5px', borderRight: '1px solid rgba(255,255,255,0.1)' };
const tdStyle = { padding: '8px 4px', textAlign: 'center', borderBottom: '1px solid #f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const divCol = { ...tdStyle, fontWeight: '800', color: '#1e3a8a', background: '#f8fafc', borderRight: '1px solid #e2e8f0', textAlign: 'left' };
const trStyle = { height: '40px' };
const vBtn = { padding: '5px 10px', background: '#fff', border: '1px solid #1e3a8a', color: '#1e3a8a', borderRadius: '4px', fontWeight: '800', fontSize: '8px', cursor: 'pointer' };
const eBtn = { padding: '5px 10px', background: '#7c2d12', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '700', fontSize: '8px', cursor: 'pointer' };
const countBadge = { padding: '2px 8px', background: '#ffedd5', color: '#7c2d12', borderRadius: '10px', fontSize: '8px', fontWeight: '900', display: 'inline-block' };

export default SupplierTracker;