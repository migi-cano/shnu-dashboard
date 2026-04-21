import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AllocationAdd = ({ divisions, data, setData, onClose }) => {
    const sidebarRef = useRef();
    const [targetDiv, setTargetDiv] = useState(divisions[0]);
    const [form, setForm] = useState({
        beneficiaries: 0, nfpAllocation: 0, milkAllocation: 0, psf: 0, subAro: 0
    });

    useEffect(() => {
        const existing = data.find(d => d.division === targetDiv);
        if (existing) {
            setForm({
                beneficiaries: existing.beneficiaries || 0,
                nfpAllocation: existing.nfpAllocation || 0,
                milkAllocation: existing.milkAllocation || 0,
                psf: existing.psf || 0,
                subAro: existing.subAro || 0
            });
        }
    }, [targetDiv, data]);

    useEffect(() => {
        const handleOutside = (e) => { if (sidebarRef.current && !sidebarRef.current.contains(e.target)) onClose(); };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [onClose]);

    const handleSave = async () => {
        try {
            const currentDO = data.find(d => d.division === targetDiv);
            const updatedData = { ...currentDO, ...form, division: targetDiv };
            const res = await axios.post('http://localhost:5000/api/suppliers/update', updatedData);
            setData(prev => prev.map(d => d.division === targetDiv ? res.data : d));
            alert(`New Allocation set for ${targetDiv}`);
            onClose();
        } catch (err) { alert("Error saving allocation."); }
    };

    return (
        <>
            <div style={backdrop} />
            <div ref={sidebarRef} style={drawer}>
                <div style={header}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '900' }}>NEW ALLOCATION ENTRY</h3>
                    <button onClick={onClose} style={closeX}>&times;</button>
                </div>
                <div style={scrollArea} className="custom-scroll">
                    <div style={inputGroup}>
                        <label style={label}>SELECT DIVISION OFFICE</label>
                        <select style={select} value={targetDiv} onChange={e => setTargetDiv(e.target.value)}>
                            {divisions.map(div => <option key={div} value={div}>{div.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div style={divider} />
                    {/* Input Fields */}
                    {['beneficiaries', 'nfpAllocation', 'milkAllocation', 'psf', 'subAro'].map(field => (
                        <div key={field} style={inputGroup}>
                            <label style={label}>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                            <input type="number" style={input} value={form[field]} onChange={e => setForm({...form, [field]: Number(e.target.value)})} />
                        </div>
                    ))}
                </div>
                <div style={footer}><button onClick={handleSave} style={saveBtn}>CREATE ENTRY</button></div>
            </div>
        </>
    );
};

// Styles (Reuse from previous version)
const backdrop = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1500, backdropFilter: 'blur(2px)' };
const drawer = { position: 'fixed', top: 0, right: 0, width: '400px', height: '100vh', background: '#fff', zIndex: 1501, display: 'flex', flexDirection: 'column' };
const header = { padding: '20px', background: '#7c2d12', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const scrollArea = { flex: 1, padding: '25px', overflowY: 'auto' };
const footer = { padding: '20px', borderTop: '1px solid #eee' };
const inputGroup = { marginBottom: '15px', display: 'flex', flexDirection: 'column' };
const label = { fontSize: '9px', fontWeight: '900', color: '#64748b' };
const input = { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' };
const select = { ...input, background: '#f8fafc', fontWeight: 'bold' };
const divider = { height: '1px', background: '#eee', margin: '10px 0' };
const saveBtn = { width: '100%', padding: '15px', background: '#7c2d12', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const closeX = { background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' };

export default AllocationAdd;