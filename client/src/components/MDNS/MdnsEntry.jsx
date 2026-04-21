import React, { useState } from 'react';
import axios from 'axios';

const DIVISIONS = ["Caloocan", "Las Piñas", "Makati", "Malabon", "Mandaluyong", "Manila", "Marikina", "Muntinlupa", "Navotas", "Parañaque", "Pasay", "Pasig", "Quezon City", "San Juan", "Taguig", "Valenzuela"];

const SectionCard = ({ title, children, color }) => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderTop: `5px solid ${color}`, marginBottom: '25px' }}>
      <h4 style={{ margin: '0 0 20px 0', color: '#0f172a', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></span>{title}
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>{children}</div>
    </div>
);

const InputField = ({ label, name, value, onChange }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '10px', color: '#0f172a', fontWeight: '900', textTransform: 'uppercase' }}>{label}</label>
      <input type="number" value={value === 0 ? '' : value} placeholder="0" onChange={(e) => onChange(name, Number(e.target.value))} style={{ padding: '12px', border: '1px solid #94a3b8', borderRadius: '8px', fontSize: '14px', color: '#0f172a', backgroundColor: '#fff', fontWeight: '700', outline: 'none' }} />
    </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '10px', color: '#0f172a', fontWeight: '900', textTransform: 'uppercase' }}>{label}</label>
      <select value={value} onChange={(e) => onChange(name, e.target.value)} style={{ padding: '12px', border: '1px solid #94a3b8', borderRadius: '8px', fontSize: '14px', color: '#0f172a', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '700' }}>
        <option value="">Select Division</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
);

const MdnsEntry = ({ activeTab, refreshData }) => {
    const INITIAL_STATE = { location: '', enrollment: 0, schoolsVisited: 0, healthTalks: 0, toothbrushingDrills: 0, oralExam: 0, cariesFree: 0, treatedMeds: 0, scalingPolishing: 0, extractionDone: 0, fillingDone: 0, fluorideVarnish: 0, healthSupplies: 0, extPerm: 0, extTemp: 0, fillPFS: 0, fillART: 0, fillZOE: 0, fillSYF: 0, dmft_D: 0, dmft_M: 0, dmft_F: 0, dmftTotal: 0, perm_ST: 0, temp_d: 0, temp_f: 0, temp_s: 0 };
    const [form, setForm] = useState(INITIAL_STATE);

    const handleInputChange = (name, value) => {
        setForm(prev => {
            const newState = { ...prev, [name]: value };
            if (['dmft_D', 'dmft_M', 'dmft_F'].includes(name)) {
                newState.dmftTotal = (newState.dmft_D || 0) + (newState.dmft_M || 0) + (newState.dmft_F || 0);
            }
            return newState;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.location) return alert("Select Division");
        try {
            await axios.post('http://localhost:5000/api/mdns', { ...form, reportType: activeTab });
            alert("Data Saved Successfully!");
            setForm(INITIAL_STATE);
            refreshData();
        } catch (err) { alert("Save Failed"); }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <SectionCard title="I. General Information" color="#2563eb">
                <SelectField label="Division" name="location" value={form.location} onChange={handleInputChange} options={DIVISIONS} />
                <InputField label="Target Population" name="enrollment" value={form.enrollment} onChange={handleInputChange} />
                <InputField label="Schools Visited" name="schoolsVisited" value={form.schoolsVisited} onChange={handleInputChange} />
                <InputField label="Health Talks" name="healthTalks" value={form.healthTalks} onChange={handleInputChange} />
                <InputField label="TB Drills" name="toothbrushingDrills" value={form.toothbrushingDrills} onChange={handleInputChange} />
            </SectionCard>

            <SectionCard title="II. Clinical Services Rendered" color="#10b981">
                <InputField label="Oral Examination" name="oralExam" value={form.oralExam} onChange={handleInputChange} />
                <InputField label="Caries-Free Target" name="cariesFree" value={form.cariesFree} onChange={handleInputChange} />
                <InputField label="Meds Distributed" name="treatedMeds" value={form.treatedMeds} onChange={handleInputChange} />
                <InputField label="Scaling/Polishing" name="scalingPolishing" value={form.scalingPolishing} onChange={handleInputChange} />
                <InputField label="Extractions" name="extractionDone" value={form.extractionDone} onChange={handleInputChange} />
                <InputField label="Fillings (Total)" name="fillingDone" value={form.fillingDone} onChange={handleInputChange} />
            </SectionCard>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '25px', marginBottom: '30px' }}>
                <SectionCard title="III. Teeth Specifications" color="#ef4444">
                    <InputField label="Extraction (Perm)" name="extPerm" value={form.extPerm} onChange={handleInputChange} />
                    <InputField label="Extraction (Temp)" name="extTemp" value={form.extTemp} onChange={handleInputChange} />
                    <InputField label="PFS (Pit/Fissure)" name="fillPFS" value={form.fillPFS} onChange={handleInputChange} />
                    <InputField label="ART Filling" name="fillART" value={form.fillART} onChange={handleInputChange} />
                    <InputField label="ZOE Filling" name="fillZOE" value={form.fillZOE} onChange={handleInputChange} />
                    <InputField label="SY F Filling" name="fillSYF" value={form.fillSYF} onChange={handleInputChange} />
                </SectionCard>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={indexCardBlue}>
                        <h5 style={indexTitle}>PERMANENT TEETH (DMF + ST)</h5>
                        <div style={miniGrid}>
                            <InputField label="D" name="dmft_D" value={form.dmft_D} onChange={handleInputChange} />
                            <InputField label="M" name="dmft_M" value={form.dmft_M} onChange={handleInputChange} />
                            <InputField label="F" name="dmft_F" value={form.dmft_F} onChange={handleInputChange} />
                            <InputField label="ST" name="perm_ST" value={form.perm_ST} onChange={handleInputChange} />
                        </div>
                        <div style={indexFooter}>DMF TOTAL INDEX: {form.dmftTotal}</div>
                    </div>
                    <div style={indexCardOrange}>
                        <h5 style={{ ...indexTitle, color: '#9a3412' }}>TEMPORARY TEETH (D, F, S)</h5>
                        <div style={miniGrid}>
                            <InputField label="d" name="temp_d" value={form.temp_d} onChange={handleInputChange} />
                            <InputField label="f" name="temp_f" value={form.temp_f} onChange={handleInputChange} />
                            <InputField label="s" name="temp_s" value={form.temp_s} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>
            </div>
            <button type="submit" style={submitBtn}>💾 SAVE MDNS DATA TO RECORD</button>
        </form>
    );
};

const indexCardBlue = { background: '#fff', padding: '20px', borderRadius: '12px', border: '2px solid #1e3a8a' };
const indexCardOrange = { background: '#fff', padding: '20px', borderRadius: '12px', border: '2px solid #9a3412' };
const indexTitle = { margin: '0 0 15px 0', fontSize: '10px', color: '#1e3a8a', fontWeight: '900', letterSpacing: '0.5px' };
const miniGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: '10px' };
const indexFooter = { textAlign: 'right', marginTop: '15px', fontWeight: '900', fontSize: '12px', color: '#0f172a', borderTop: '2px solid #e2e8f0', paddingTop: '10px' };
const submitBtn = { width: '100%', padding: '20px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '15px', cursor: 'pointer', marginBottom: '50px' };

export default MdnsEntry;