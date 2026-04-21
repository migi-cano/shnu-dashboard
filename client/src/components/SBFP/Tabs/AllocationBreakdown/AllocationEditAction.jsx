import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AllocationEditAction = ({ selectedDO, setData, onClose }) => {
    const sidebarRef = useRef();
    const [form, setForm] = useState({
        beneficiaries: selectedDO.beneficiaries || 0,
        nfpAllocation: selectedDO.nfpAllocation || 0,
        milkAllocation: selectedDO.milkAllocation || 0,
        psf: selectedDO.psf || 0,
        subAro: selectedDO.subAro || 0
    });

    useEffect(() => {
        const handleOutside = (e) => { if (sidebarRef.current && !sidebarRef.current.contains(e.target)) onClose(); };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [onClose]);

    const handleUpdate = async () => {
        try {
            const updated = { ...selectedDO, ...form };
            const res = await axios.post('http://localhost:5000/api/suppliers/update', updated);
            setData(prev => prev.map(d => d.division === selectedDO.division ? res.data : d));
            alert("Allocation Updated Successfully!");
            onClose();
        } catch (err) { alert("Update failed"); }
    };

    return (
        <>
            <div style={backdrop} />
            <div ref={sidebarRef} style={drawer}>
                <div style={{ ...header, background: '#1e3a8a' }}>
                    <h3 style={{ margin: 0, fontSize: '14px' }}>EDIT: {selectedDO.division.toUpperCase()}</h3>
                    <button onClick={onClose} style={closeX}>&times;</button>
                </div>
                <div style={scrollArea} className="custom-scroll">
                    {['beneficiaries', 'nfpAllocation', 'milkAllocation', 'psf', 'subAro'].map(field => (
                        <div key={field} style={inputGroup}>
                            <label style={label}>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                            <input type="number" style={input} value={form[field]} onChange={e => setForm({...form, [field]: Number(e.target.value)})} />
                        </div>
                    ))}
                </div>
                <div style={footer}><button onClick={handleUpdate} style={{ ...saveBtn, background: '#1e3a8a' }}>SAVE CHANGES</button></div>
            </div>
        </>
    );
};

// Styles remain the same as AllocationAdd (copy variables here)
const backdrop = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1500, backdropFilter: 'blur(2px)' };
const drawer = { position: 'fixed', top: 0, right: 0, width: '400px', height: '100vh', background: '#fff', zIndex: 1501, display: 'flex', flexDirection: 'column' };
const header = { padding: '20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const scrollArea = { flex: 1, padding: '25px', overflowY: 'auto' };
const footer = { padding: '20px', borderTop: '1px solid #eee' };
const inputGroup = { marginBottom: '15px', display: 'flex', flexDirection: 'column' };
const label = { fontSize: '9px', fontWeight: '900', color: '#64748b' };
const input = { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' };
const saveBtn = { width: '100%', padding: '15px', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const closeX = { background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' };

export default AllocationEditAction;