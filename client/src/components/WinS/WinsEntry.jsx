import React, { useState } from 'react';
import axios from 'axios';

const DIVISIONS = ["Caloocan", "Las Piñas", "Makati", "Malabon", "Mandaluyong", "Manila", "Marikina", "Muntinlupa", "Navotas", "Parañaque", "Pasay", "Pasig", "Quezon City", "San Juan", "Taguig", "Valenzuela"];
const fontStack = '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif';

const WinsEntry = ({ onSave }) => {
    const [form, setForm] = useState({ division: '', schoolName: '', level: 'Elementary', stars: '0' });
    const [showModal, setShowModal] = useState(false); // 🚀 Modal State

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.division || !form.schoolName) return alert("Validation Failed: All fields are required.");
        try {
            await axios.post('http://localhost:5000/api/wins', form);
            setShowModal(true); // 🚀 Show Modal instead of alert
            setForm({ ...form, schoolName: '', stars: '0' });
            onSave();
        } catch (err) { alert("Network Error: Could not reach server."); }
    };

    return (
        <div style={formWrapper}>
            <form onSubmit={handleSave} style={formContainer}>
                <h3 style={sectionLabel}>WinS ASSESSMENT ENCODER</h3>
                
                <div style={inputGrid}>
                    <div style={field}>
                        <label style={labelStyle}>DIVISION OFFICE</label>
                        <select style={inputStyle} value={form.division} onChange={e => setForm({...form, division: e.target.value})}>
                            <option value="">Select Division...</option>
                            {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div style={field}>
                        <label style={labelStyle}>SCHOOL NAME</label>
                        <input type="text" style={inputStyle} placeholder="Enter full school name" value={form.schoolName} onChange={e => setForm({...form, schoolName: e.target.value})} />
                    </div>
                </div>

                <div style={inputGrid}>
                    <div style={field}>
                        <label style={labelStyle}>ACADEMIC LEVEL</label>
                        <div style={radioGroup}>
                            {['Elementary', 'Secondary'].map(lvl => (
                                <button key={lvl} type="button" onClick={() => setForm({...form, level: lvl})} style={form.level === lvl ? radioActive : radioInactive}>
                                    {lvl.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={field}>
                        <label style={labelStyle}>STAR RATING STATUS</label>
                        <div style={starGrid}>
                            {['0', '1', '2', '3'].map(s => (
                                <button key={s} type="button" onClick={() => setForm({...form, stars: s})} style={form.stars === s ? starActive : starInactive}>
                                    {s === '0' ? 'NONE' : '★'.repeat(s)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button type="submit" style={submitBtn}>SUBMIT TO REGIONAL REGISTRY</button>
            </form>

            {/* 🚀 SUCCESS MODAL */}
            {showModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={successIcon}>✓</div>
                        <h2 style={modalTitle}>DATA TRANSMITTED</h2>
                        <p style={modalText}>School assessment has been successfully uploaded to the regional database.</p>
                        <button onClick={() => setShowModal(false)} style={closeBtn}>CONTINUE ENCODING</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- RETAINED CURRENT UI STYLES ---
const formWrapper = { display: 'flex', justifyContent: 'center', fontFamily: fontStack };
const formContainer = { background: '#fff', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '850px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' };
const sectionLabel = { fontSize: '11px', color: '#1e3a8a', fontWeight: '800', letterSpacing: '1.5px', marginBottom: '32px', paddingBottom: '8px', borderBottom: '2px solid #1e3a8a', display: 'inline-block' };
const inputGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '24px' };
const field = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '12px', fontWeight: '700', color: '#0f172a', letterSpacing: '0.025em' };
const inputStyle = { padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #cbd5e1', background: '#ffffff', fontWeight: '600', fontSize: '14px', color: '#000000', fontFamily: fontStack, outline: 'none' };
const radioGroup = { display: 'flex', gap: '12px' };
const radioBase = { flex: 1, padding: '12px', borderRadius: '8px', border: '1.5px solid #0f172a', cursor: 'pointer', fontSize: '11px', fontWeight: '800', fontFamily: fontStack };
const radioActive = { ...radioBase, background: '#0f172a', color: '#fff' };
const radioInactive = { ...radioBase, background: '#fff', color: '#0f172a' };
const starGrid = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' };
const starActive = { ...radioBase, background: '#b45309', color: '#fff', borderColor: '#78350f' };
const starInactive = { ...radioBase, background: '#fff', color: '#b45309', borderColor: '#fed7aa' };
const submitBtn = { width: '100%', padding: '16px', borderRadius: '10px', border: 'none', background: '#1e3a8a', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '24px', fontFamily: fontStack };

// --- 🚀 NEW MODAL STYLES (MATCHING YOUR THEME) ---
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 };
const modalContent = { background: '#fff', padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '400px', border: '3px solid #0f172a', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' };
const successIcon = { width: '60px', height: '60px', background: '#16a34a', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 20px auto', fontWeight: '900' };
const modalTitle = { fontSize: '20px', fontWeight: '900', color: '#0f172a', margin: '0 0 10px 0' };
const modalText = { fontSize: '14px', color: '#475569', fontWeight: '600', lineHeight: '1.5', marginBottom: '25px' };
const closeBtn = { background: '#0f172a', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', width: '100%' };

export default WinsEntry;