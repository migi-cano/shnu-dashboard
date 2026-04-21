import React, { useEffect, useRef } from 'react';

const AllocationView = ({ selectedDO, onClose }) => {
    const sidebarRef = useRef();

    useEffect(() => {
        const handleOutside = (e) => { if (sidebarRef.current && !sidebarRef.current.contains(e.target)) onClose(); };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [onClose]);

    const total = (selectedDO.nfpAllocation || 0) + (selectedDO.milkAllocation || 0) + (selectedDO.psf || 0) + (selectedDO.subAro || 0);

    return (
        <>
            <div style={backdrop} />
            <div ref={sidebarRef} style={drawer}>
                <div style={header}>
                    <h3 style={{ margin: 0 }}>ALLOCATION SUMMARY</h3>
                    <button onClick={onClose} style={closeX}>&times;</button>
                </div>
                
                <div style={{ padding: '30px' }}>
                    <h2 style={{ color: '#1e3a8a', marginBottom: '5px' }}>{selectedDO.division.toUpperCase()}</h2>
                    <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '25px' }}>Budgetary Allocation for FY 2026</p>

                    <div style={statGrid}>
                        <div style={statCard}>
                            <label style={label}>TARGET BENEFICIARIES</label>
                            <div style={val}>{selectedDO.beneficiaries?.toLocaleString() || 0} Students</div>
                        </div>
                        <div style={{ ...statCard, borderLeft: '4px solid #7c2d12' }}>
                            <label style={label}>GRAND TOTAL ALLOTMENT</label>
                            <div style={{ ...val, color: '#7c2d12', fontSize: '20px' }}>₱{total.toLocaleString()}</div>
                        </div>
                    </div>

                    <div style={list}>
                        <div style={listItem}><span>NFP Allocation:</span> <b>₱{selectedDO.nfpAllocation?.toLocaleString() || 0}</b></div>
                        <div style={listItem}><span>Milk Allocation:</span> <b>₱{selectedDO.milkAllocation?.toLocaleString() || 0}</b></div>
                        <div style={listItem}><span>PSF:</span> <b>₱{selectedDO.psf?.toLocaleString() || 0}</b></div>
                        <div style={listItem}><span>Sub-Aro:</span> <b>₱{selectedDO.subAro?.toLocaleString() || 0}</b></div>
                    </div>
                </div>
            </div>
        </>
    );
};

const backdrop = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1500 };
const drawer = { position: 'fixed', top: 0, right: 0, width: '400px', height: '100vh', background: '#fff', zIndex: 1501, boxShadow: '-5px 0 15px rgba(0,0,0,0.1)' };
const header = { padding: '20px', background: '#1e3a8a', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const closeX = { background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' };
const statGrid = { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' };
const statCard = { padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' };
const label = { fontSize: '9px', fontWeight: '800', color: '#64748b' };
const val = { fontSize: '16px', fontWeight: '900', color: '#1e3a8a', marginTop: '5px' };
const list = { borderTop: '1px solid #e2e8f0', paddingTop: '20px' };
const listItem = { display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '13px', borderBottom: '1px solid #f8fafc' };

export default AllocationView;