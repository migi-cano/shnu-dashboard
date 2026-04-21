import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AllocationAdd from './AllocationAdd';
import AllocationEditAction from './AllocationEditAction';
import AllocationView from './AllocationView';

const DIVISIONS = ["Caloocan", "Las Piñas", "Makati", "Malabon", "Mandaluyong", "Manila", "Marikina", "Muntinlupa", "Navotas", "Parañaque", "Pasay", "Pasig", "Quezon City", "San Juan", "Taguig", "Valenzuela"];

const AllocationBreakdown = () => {
    const [data, setData] = useState([]);
    const [selectedDO, setSelectedDO] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showView, setShowView] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/suppliers');
            
            // Sync logic: Ensure all 16 divisions appear even if not yet in MongoDB
            const mergedData = DIVISIONS.map(divName => {
                const existing = res.data.find(d => d.division.toLowerCase() === divName.toLowerCase());
                return existing || { 
                    division: divName, 
                    beneficiaries: 0, 
                    nfpAllocation: 0, 
                    milkAllocation: 0, 
                    psf: 0, 
                    subAro: 0 
                };
            });
            
            setData(mergedData);
        } catch (err) {
            console.error("Fetch error:", err);
            setData(DIVISIONS.map(div => ({ division: div, beneficiaries: 0, nfpAllocation: 0, milkAllocation: 0, psf: 0, subAro: 0 })));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div style={{ padding: '20px', fontWeight: '800', textAlign: 'center' }}>Loading Allocation Ledger...</div>;

    return (
        <div className="custom-scroll" style={containerStyle}>
            
            {/* 1. HEADER SECTION WITH TOP-RIGHT BUTTON */}
            <div style={headerSection}>
                <div>
                    <h2 style={{ margin: 0, color: '#7c2d12', fontSize: '20px', fontWeight: '900' }}>FUND ALLOCATION BREAKDOWN</h2>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>FY 2026 Planning & Direct Release Distribution</p>
                </div>
                <button onClick={() => setShowAdd(true)} style={mainBtn}>+ SET ALLOCATION</button>
            </div>

            {/* 2. MAIN TABLE */}
            <div style={tableWrapper}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5px' }}>
                    <thead>
                        <tr style={{ background: '#7c2d12', color: '#fff' }}>
                            <th style={thSide}>DIVISION OFFICE</th>
                            <th style={th}>BENEFICIARIES</th>
                            <th style={th}>NFP ALLOC.</th>
                            <th style={th}>MILK ALLOC.</th>
                            <th style={th}>PSF</th>
                            <th style={th}>SUB-ARO</th>
                            <th style={{ ...th, background: '#4c1d0e' }}>TOTAL ALLOTMENT</th>
                            <th style={{ ...th, width: '120px' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => {
                            const total = (row.nfpAllocation || 0) + (row.milkAllocation || 0) + (row.psf || 0) + (row.subAro || 0);
                            return (
                                <tr key={row.division} style={trStyle}>
                                    <td style={tdDivision}>{row.division.toUpperCase()}</td>
                                    <td style={td}>{row.beneficiaries?.toLocaleString() || 0}</td>
                                    <td style={td}>₱{(row.nfpAllocation || 0).toLocaleString()}</td>
                                    <td style={td}>₱{(row.milkAllocation || 0).toLocaleString()}</td>
                                    <td style={td}>₱{(row.psf || 0).toLocaleString()}</td>
                                    <td style={td}>₱{(row.subAro || 0).toLocaleString()}</td>
                                    <td style={tdTotal}>₱{total.toLocaleString()}</td>
                                    
                                    {/* ROW ACTIONS */}
                                    <td style={td}>
                                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                            <button 
                                                onClick={() => { setSelectedDO(row); setShowView(true); }}
                                                style={vBtn}
                                            >
                                                VIEW
                                            </button>
                                            <button 
                                                onClick={() => { setSelectedDO(row); setShowEdit(true); }}
                                                style={eBtn}
                                            >
                                                EDIT
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* 3. MODALS/DRAWERS */}
            {showAdd && (
                <AllocationAdd 
                    divisions={DIVISIONS} 
                    data={data} 
                    setData={setData} 
                    onClose={() => setShowAdd(false)} 
                />
            )}

            {showEdit && (
                <AllocationEditAction 
                    selectedDO={selectedDO} 
                    setData={setData} 
                    onClose={() => setShowEdit(false)} 
                />
            )}

            {showView && (
                <AllocationView 
                    selectedDO={selectedDO} 
                    onClose={() => setShowView(false)} 
                />
            )}

            <style>{`.custom-scroll::-webkit-scrollbar { width: 6px; } .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }`}</style>
        </div>
    );
};

// --- STYLES ---
const containerStyle = { padding: '0 20px 20px', height: '100%', overflowY: 'auto' };
const headerSection = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' };
const mainBtn = { padding: '10px 20px', background: '#7c2d12', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '10px' };

const tableWrapper = { background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const th = { padding: '12px 8px', fontWeight: '800', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' };
const thSide = { ...th, textAlign: 'left', width: '170px', paddingLeft: '15px' };

const trStyle = { borderBottom: '1px solid #f1f5f9' };
const td = { padding: '12px 8px', textAlign: 'center', color: '#475569' };
const tdDivision = { ...td, fontWeight: '800', color: '#1e3a8a', textAlign: 'left', background: '#f8fafc', paddingLeft: '15px', borderRight: '1px solid #e2e8f0' };
const tdTotal = { ...td, fontWeight: '900', color: '#7c2d12', background: '#fff7ed' };

// Action Button Styles
const vBtn = { padding: '5px 10px', background: '#fff', border: '1px solid #1e3a8a', color: '#1e3a8a', borderRadius: '4px', fontSize: '9px', fontWeight: '800', cursor: 'pointer' };
const eBtn = { padding: '5px 10px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '9px', fontWeight: '800', cursor: 'pointer' };

export default AllocationBreakdown;