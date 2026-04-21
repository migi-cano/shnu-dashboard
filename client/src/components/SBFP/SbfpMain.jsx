import React, { useState, useEffect } from 'react';
import axios from 'axios';

import SupplierTracker from './Tabs/SupplierTracker/SupplierTracker';
import AllocationBreakdown from './Tabs/AllocationBreakdown/AllocationBreakdown';
import FinancialMain from './Tabs/FinancialStatus/FinancialMain';

const SbfpMain = () => {
    const [activeTab, setActiveTab] = useState('TAB1');
    const [data, setData] = useState([]); // 🚀 Shared Data State

    // 🚀 Fetch data once at the parent level
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/suppliers');
                setData(res.data);
            } catch (err) {
                console.error("Fetch Error:", err);
            }
        };
        fetchData();
    }, []);

    const tabs = [
        { id: 'TAB1', label: 'Supplier Payment Tracker & Directory' },
        { id: 'TAB2', label: 'Breakdown of Allocation of Funds' },
        { id: 'TAB3', label: 'Status of Fund Utilization' },
        { id: 'TAB4', label: 'Regular Procurement Status' },
        { id: 'TAB5', label: 'Milk Procurement Status' },
        { id: 'TAB6', label: 'Central Kitchen' },
        { id: 'TAB7', label: 'SBFP Hired CoS 2025' },
        { id: 'TAB8', label: 'Detailed Utilization Status' },
        { id: 'TAB9', label: 'Directory' }
    ];

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#f8fafc'
        }}>

            {/* 1. SBFP TOP HEADER */}
            <div style={{
                flex: '0 0 auto',
                background: 'linear-gradient(90deg, #581c87 0%, #7c2d12 100%)',
                padding: '12px 20px',
                color: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ margin: 0, fontSize: '16px', letterSpacing: '0.5px', fontWeight: '800' }}>
                    SCHOOL-BASED FEEDING PROGRAM (SBFP) 2026
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '10px', opacity: 0.8, fontWeight: '500' }}>
                    Regional Financial & Procurement Management Portal
                </p>
            </div>

            {/* 2. TAB NAVIGATION BAR */}
            <div style={{
                flex: '0 0 auto',
                display: 'flex',
                gap: '6px',
                padding: '10px 15px',
                background: '#fff',
                borderBottom: '1px solid #e2e8f0',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'none'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '9px',
                            fontWeight: '700',
                            transition: 'all 0.2s ease',
                            backgroundColor: activeTab === tab.id ? '#7c2d12' : '#f1f5f9',
                            color: activeTab === tab.id ? '#fff' : '#64748b',
                        }}
                    >
                        {tab.label.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* 3. DYNAMIC CONTENT LOADING AREA */}
            <div style={{
                flex: 1,
                width: '100%',
                overflow: 'hidden',
                padding: '15px',
                boxSizing: 'border-box',
                display: 'flex'
            }}>
                <div style={{
                    flex: 1,
                    background: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>

                    {/* 💡 CONDITIONAL RENDERING WITH PROPS */}
                    {activeTab === 'TAB1' && <SupplierTracker data={data} setData={setData} />}
                    {activeTab === 'TAB2' && <AllocationBreakdown />}
                    {activeTab === 'TAB3' && <FinancialMain data={data} />}

                    {/* 💡 UPDATED PLACEHOLDER LOGIC (Excludes TAB1, TAB2, and TAB3) */}
                    {!['TAB1', 'TAB2', 'TAB3'].includes(activeTab) && (
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#94a3b8'
                        }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px', opacity: 0.2 }}>📂</div>
                            <h3 style={{ fontSize: '14px', margin: 0 }}>{tabs.find(t => t.id === activeTab)?.label}</h3>
                            <p style={{ fontSize: '10px' }}>Module development in progress...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SbfpMain;