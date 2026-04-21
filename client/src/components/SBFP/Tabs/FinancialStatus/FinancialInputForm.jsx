import React, { useState } from 'react';
import axios from 'axios';

const DIVISIONS = ["Caloocan", "Las Piñas", "Makati", "Malabon", "Mandaluyong", "Manila", "Marikina", "Muntinlupa", "Navotas", "Parañaque", "Pasay", "Pasig", "Quezon City", "San Juan", "Taguig", "Valenzuela"];

const FinancialInputForm = ({ onSave }) => {
    const [form, setForm] = useState({
        division: '',
        item: 'PSF',
        abc: '',
        actualContract: '',
        obligated: '',
        disbursement: '',
        liquidated: '',
        remarks: ''
    });

    const handleSave = async () => {
        if (!form.division) return alert("Select Division");
        try {
            await axios.post('http://localhost:5000/api/sfu-records', form);
            onSave();
        } catch (err) { alert("Save Failed"); }
    };

    return (
        <div style={formCard}>
            <h4 style={formTitle}>SFU ENTRY ENCODER</h4>
            <div style={grid}>
                <div style={inputGrp}><label style={label}>Division</label>
                    <select style={input} onChange={e => setForm({...form, division: e.target.value})}>
                        <option value="">--Select--</option>
                        {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div style={inputGrp}><label style={label}>Item / Component</label>
                    <select style={input} onChange={e => setForm({...form, item: e.target.value})}>
                        <option>PSF</option><option>NFP</option><option>Milk</option><option>OpEx</option><option>Hiring of CoS</option>
                    </select>
                </div>
                <div style={inputGrp}><label style={label}>Approved Budget (ABC)</label><input type="number" style={input} onChange={e => setForm({...form, abc: e.target.value})} /></div>
                <div style={inputGrp}><label style={label}>Actual Contract</label><input type="number" style={input} onChange={e => setForm({...form, actualContract: e.target.value})} /></div>
                <div style={inputGrp}><label style={label}>Obligated Amount</label><input type="number" style={input} onChange={e => setForm({...form, obligated: e.target.value})} /></div>
                <div style={inputGrp}><label style={label}>Disbursement</label><input type="number" style={input} onChange={e => setForm({...form, disbursement: e.target.value})} /></div>
                <div style={inputGrp}><label style={label}>Liquidated (If applicable)</label><input type="number" style={input} onChange={e => setForm({...form, liquidated: e.target.value})} /></div>
                <div style={inputGrp}><label style={label}>Remarks</label><input type="text" style={input} onChange={e => setForm({...form, remarks: e.target.value})} /></div>
            </div>
            <button onClick={handleSave} style={saveBtn}>💾 SAVE TO SFU</button>
        </div>
    );
};

const formCard = { background: '#fff', padding: '25px', borderRadius: '12px', border: '2px solid #cbd5e1', maxWidth: '800px', margin: '0 auto' };
const formTitle = { margin: '0 0 20px 0', fontSize: '11px', fontWeight: '900', color: '#7c2d12' };
const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const inputGrp = { display: 'flex', flexDirection: 'column', gap: '4px' };
const label = { fontSize: '9px', fontWeight: '900', color: '#475569' };
const input = { padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', fontWeight: '700' };
const saveBtn = { marginTop: '20px', width: '100%', padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '900', cursor: 'pointer' };

export default FinancialInputForm;