import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SupplierViewStatement = ({ selectedDO, data, setData, onClose }) => {
    // Combine NFP and Milk into one list for the sidebar
    const allSuppliers = [
        ...selectedDO.nfp.map((s, index) => ({ ...s, category: 'NFP', originalIndex: index })),
        ...selectedDO.milk.map((s, index) => ({ ...s, category: 'MILK', originalIndex: index }))
    ];

    const [activeSupplier, setActiveSupplier] = useState(allSuppliers[0] || null);
    const sidebarRef = useRef();

    // Click Outside to Close
    useEffect(() => {
        const handleOutside = (e) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target)) onClose();
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [onClose]);

    const getPerc = (cum, con) => (con > 0 ? ((cum / con) * 100).toFixed(1) : "0.0");

    // 🗑️ DELETE LOGIC
    const handleDelete = async () => {
        if (!activeSupplier) return;

        const confirmDelete = window.confirm(`WARNING: You are about to permanently delete "${activeSupplier.payee}" from the ${activeSupplier.category} records. Proceed?`);
        if (!confirmDelete) return;

        const typeKey = activeSupplier.category.toLowerCase(); // 'nfp' or 'milk'
        
        // Filter out the item based on the original index
        const updatedItems = selectedDO[typeKey].filter((_, i) => i !== activeSupplier.originalIndex);
        
        const updatedDivision = {
            ...selectedDO,
            [typeKey]: updatedItems
        };

        try {
            const res = await axios.post('http://localhost:5000/api/suppliers/update', updatedDivision);
            
            // Sync main table
            setData(prev => prev.map(d => d.division === selectedDO.division ? res.data : d));
            
            alert("Record successfully removed from ledger.");
            onClose(); // Close the view to refresh state
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <>
            <div style={backdrop} />
            <div ref={sidebarRef} style={fullSpaceDrawer}>
                
                {/* HEADER */}
                <div style={{ ...header, background: activeSupplier?.category === 'MILK' ? '#1e40af' : '#7c2d12' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>DIVISION FINANCIAL DIRECTORY</h3>
                        <p style={{ margin: 0, fontSize: '10px', opacity: 0.8 }}>{selectedDO.division.toUpperCase()} • PROCUREMENT OVERSIGHT</p>
                    </div>
                    <button onClick={onClose} style={closeX}>×</button>
                </div>

                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    
                    {/* LEFT SIDEBAR: LIST OF SUPPLIERS */}
                    <div style={sidebar}>
                        <h4 style={sideTitle}>ACTIVE SUPPLIERS ({allSuppliers.length})</h4>
                        <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto' }}>
                            {allSuppliers.map((s, i) => (
                                <div
                                    key={i}
                                    onClick={() => setActiveSupplier(s)}
                                    style={{
                                        ...supplierItem,
                                        borderLeftColor: s.category === 'MILK' ? '#1e40af' : '#7c2d12',
                                        background: activeSupplier?.payee === s.payee && activeSupplier?.category === s.category ? '#f1f5f9' : 'transparent',
                                        fontWeight: activeSupplier?.payee === s.payee ? '800' : '500'
                                    }}
                                >
                                    <div style={{ fontSize: '11px' }}>{s.payee}</div>
                                    <div style={{ fontSize: '8px', color: '#64748b', marginTop: '2px' }}>{s.category} COMPONENT</div>
                                </div>
                            ))}
                            {allSuppliers.length === 0 && <p style={emptyMsg}>No suppliers found.</p>}
                        </div>
                    </div>

                    {/* RIGHT PANEL: DETAILED INFORMATION */}
                    <div style={mainPanel}>
                        {activeSupplier ? (
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
                                    
                                    <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                                        <div style={detailTile}>
                                            <span style={tileLabel}>CONTRACT AMOUNT</span>
                                            <div style={tileVal}>₱{activeSupplier.contract.toLocaleString()}</div>
                                        </div>
                                        <div style={detailTile}>
                                            <span style={tileLabel}>TOTAL PAID TO DATE</span>
                                            <div style={{ ...tileVal, color: '#16a34a' }}>₱{activeSupplier.cumulative.toLocaleString()}</div>
                                        </div>
                                        <div style={detailTile}>
                                            <span style={tileLabel}>UTILIZATION %</span>
                                            <div style={{ ...tileVal, color: '#7c2d12' }}>{getPerc(activeSupplier.cumulative, activeSupplier.contract)}%</div>
                                        </div>
                                    </div>

                                    <h4 style={sectionTitle}>SUPPLIER SPECIFICATIONS</h4>
                                    <table style={detailTable}>
                                        <tbody>
                                            <tr>
                                                <td style={labelCol}>COMPANY NAME</td>
                                                <td style={valCol}>{activeSupplier.payee}</td>
                                            </tr>
                                            <tr>
                                                <td style={labelCol}>PROGRAM COMPONENT</td>
                                                <td style={valCol}>{activeSupplier.category}</td>
                                            </tr>
                                            <tr>
                                                <td style={labelCol}>ACCOUNT STATUS</td>
                                                <td style={valCol}><span style={statusBadge}>ACTIVE / VERIFIED</span></td>
                                            </tr>
                                            <tr>
                                                <td style={{ ...labelCol, color: '#b91c1c' }}>REMAINING BALANCE</td>
                                                <td style={{ ...valCol, fontWeight: '900', color: '#b91c1c' }}>
                                                    ₱{(activeSupplier.contract - activeSupplier.cumulative).toLocaleString()}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* 💡 DELETE BUTTON AT THE LOWEST PART OF THE VIEW */}
                                <div style={footerAction}>
                                    <button onClick={handleDelete} style={deleteBtn}>
                                        <span style={{ marginRight: '8px' }}>🗑️</span>
                                        DELETE THIS PROCUREMENT RECORD
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={emptyState}>Select a supplier from the list to view financial details.</div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`.custom-scroll::-webkit-scrollbar { width: 4px; } .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }`}</style>
        </>
    );
};

// --- STYLES ---
const backdrop = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', zIndex: 1500, backdropFilter: 'blur(2px)' };
const fullSpaceDrawer = { position: 'fixed', top: 0, right: 0, width: '850px', height: '100vh', background: '#fff', zIndex: 1501, display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.2)' };
const header = { padding: '20px 30px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 };
const sidebar = { width: '280px', borderRight: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', flexDirection: 'column' };
const mainPanel = { flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' };
const sideTitle = { padding: '15px', fontSize: '10px', fontWeight: '800', color: '#475569', borderBottom: '1px solid #e2e8f0', margin: 0 };
const supplierItem = { padding: '15px', borderLeft: '4px solid transparent', borderBottom: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2' };
const detailTile = { flex: 1, padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' };
const tileLabel = { fontSize: '9px', fontWeight: '800', color: '#64748b', display: 'block' };
const tileVal = { fontSize: '18px', fontWeight: '900', color: '#1e293b', marginTop: '5px' };
const detailTable = { width: '100%', borderCollapse: 'collapse', marginTop: '10px' };
const labelCol = { padding: '12px', borderBottom: '1px solid #f1f5f9', fontSize: '10px', fontWeight: '800', color: '#64748b', width: '200px' };
const valCol = { padding: '12px', borderBottom: '1px solid #f1f5f9', fontSize: '12px', color: '#1e293b' };
const sectionTitle = { fontSize: '11px', fontWeight: '800', color: '#1e3a8a', marginBottom: '15px', letterSpacing: '0.5px' };
const statusBadge = { padding: '3px 8px', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '9px', fontWeight: '800' };
const closeX = { border: 'none', background: 'transparent', color: '#fff', fontSize: '26px', cursor: 'pointer' };
const emptyState = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8', fontSize: '12px' };
const emptyMsg = { padding: '20px', fontSize: '10px', color: '#94a3b8', textAlign: 'center' };

const footerAction = {
    padding: '20px 30px',
    borderTop: '1px solid #f1f5f9',
    background: '#fff',
    flexShrink: 0
};

const deleteBtn = {
    width: '100%',
    padding: '12px',
    background: '#fff1f2',
    color: '#b91c1c',
    border: '1px solid #fecdd3',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

export default SupplierViewStatement;