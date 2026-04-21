import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FinancialInputForm from './FinancialInputForm';
import SfuSummaryTable from './SfuSummaryTable';

const FinancialMain = () => {
    const [view, setView] = useState('summary');
    const [sfuData, setSfuData] = useState([]);

    const fetchSfuData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/sfu-records');
            setSfuData(res.data);
        } catch (err) { console.error("Error fetching SFU:", err); }
    };

    useEffect(() => { fetchSfuData(); }, []);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
            <div style={subHeader}>
                <button onClick={() => setView('summary')} style={view === 'summary' ? activeBtn : inactiveBtn}>📊 VIEW SFU REPORT</button>
                <button onClick={() => setView('input')} style={view === 'input' ? activeBtn : inactiveBtn}>📝 ENCODE NEW ENTRY</button>
            </div>

            <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {view === 'summary' ? (
                    <SfuSummaryTable data={sfuData} />
                ) : (
                    <FinancialInputForm onSave={() => { fetchSfuData(); setView('summary'); }} />
                )}
            </div>
        </div>
    );
};

const subHeader = { padding: '10px 20px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '10px' };
const activeBtn = { padding: '8px 16px', background: '#7c2d12', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: '800' };
const inactiveBtn = { ...activeBtn, background: '#f1f5f9', color: '#64748b' };

export default FinancialMain;