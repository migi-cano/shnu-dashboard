import React, { useState } from 'react';
import axios from 'axios';

const SupplierForm = ({ divisions, data, setData, onClose }) => {
    const [targetDO, setTargetDO] = useState(divisions[0]);
    const [entry, setEntry] = useState({ type: 'nfp', payee: '', contract: 0 });

    const handleSave = async () => {
        if (entry.type !== 'sl' && !entry.payee.trim()) return alert("Enter Payee Name");

        const updated = data.map(row => {
            if (row.division === targetDO) {
                if (entry.type === 'sl') return { ...row, sl: { amount: entry.contract, status: 'Active' } };
                return { ...row, [entry.type]: [...row[entry.type], { ...entry, monthly: 0, cumulative: 0 }] };
            }
            return row;
        });

        // Find the updated division data
        const updatedDivision = updated.find(d => d.division === targetDO);

        // Save to database
        try {
            console.log('Saving new entry to database:', updatedDivision);
            const response = await axios.post('http://localhost:5000/api/suppliers/update', updatedDivision);
            console.log('✅ Entry saved to database:', response.data);

            // Update local state with the response data from DB
            setData(prevData => prevData.map(item =>
                item.division === targetDO ? response.data : item
            ));

            alert("Entry saved to database!");
            onClose();
        } catch (err) {
            console.error('Save error:', err.response?.data || err.message);
            alert("Failed to save entry: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <>
            <div onClick={onClose} style={backdrop} />
            <div style={largeDrawer}>
                <div style={header}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>NEW PROCUREMENT ENTRY</h3>
                    <button onClick={onClose} style={closeX}>×</button>
                </div>
                <div style={scrollArea} className="custom-scroll">
                    <label style={lab}>DIVISION</label>
                    <select value={targetDO} onChange={e => setTargetDO(e.target.value)} style={inp}>
                        {divisions.map(div => <option key={div} value={div}>{div}</option>)}
                    </select>
                    <label style={{ ...lab, marginTop: '20px' }}>COMPONENT</label>
                    <select value={entry.type} onChange={e => setEntry({ ...entry, type: e.target.value })} style={inp}>
                        <option value="nfp">NFP</option>
                        <option value="milk">MILK</option>
                        <option value="sl">SCHOOL-LEVEL</option>
                    </select>
                    {entry.type !== 'sl' && (
                        <>
                            <label style={{ ...lab, marginTop: '20px' }}>PAYEE NAME</label>
                            <input type="text" onChange={e => setEntry({ ...entry, payee: e.target.value })} style={inp} />
                        </>
                    )}
                    <label style={{ ...lab, marginTop: '20px' }}>CONTRACT ALLOTMENT</label>
                    <input type="number" onChange={e => setEntry({ ...entry, contract: Number(e.target.value) })} style={inp} />
                </div>
                <div style={footer}><button onClick={handleSave} style={saveBtn}>POST ENTRY</button></div>
            </div>
            <style>{`.custom-scroll::-webkit-scrollbar { width: 5px; } .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }`}</style>
        </>
    );
};

const backdrop = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 999, backdropFilter: 'blur(2px)' };
const largeDrawer = { position: 'fixed', top: 0, right: 0, width: '480px', height: '100vh', background: '#fff', zIndex: 1000, display: 'flex', flexDirection: 'column' };
const header = { padding: '25px', background: '#7c2d12', color: '#fff', display: 'flex', justifyContent: 'space-between' };
const scrollArea = { flex: 1, padding: '30px', overflowY: 'auto' };
const footer = { padding: '20px', borderTop: '1px solid #eee' };
const lab = { fontSize: '10px', fontWeight: '800', color: '#64748b', display: 'block', marginBottom: '5px' };
const inp = { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' };
const saveBtn = { width: '100%', padding: '15px', background: '#7c2d12', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '800', cursor: 'pointer' };
const closeX = { border: 'none', background: 'transparent', color: '#fff', fontSize: '24px', cursor: 'pointer' };

export default SupplierForm;