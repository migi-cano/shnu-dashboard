import React, { useState, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    CartesianGrid, Legend, PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#ef4444', '#64748b', '#3b82f6', '#10b981', '#f59e0b'];

const MdnsAnalytics = ({ activeTab, allData, selectedDivision }) => {
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        if (selectedDivision === 'OVERALL') {
            setFilteredData(allData);
        } else {
            setFilteredData(allData.filter(d => d.location === selectedDivision));
        }
    }, [selectedDivision, allData]);

    const sumVal = (field) => filteredData.reduce((acc, curr) => acc + (curr[field] || 0), 0);

    // Data for Pie Chart
    const teethIndicesData = [
        { name: 'Decayed (D)', value: sumVal('dmft_D') + sumVal('temp_d') },
        { name: 'Missing (M)', value: sumVal('dmft_M') },
        { name: 'Filled (F)', value: sumVal('dmft_F') + sumVal('temp_f') },
    ];

    // Data for Service Rendered Bar
    const servicesData = [
        { name: 'Exams', count: sumVal('oralExam') },
        { name: 'Scaling', count: sumVal('scalingPolishing') },
        { name: 'Extracted', count: sumVal('extractionDone') },
        { name: 'Fillings', count: sumVal('fillingDone') },
        { name: 'Fluoride', count: sumVal('fluorideVarnish') },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
            
            {/* KPI ROW */}
            {['Population', 'Schools', 'Talks', 'Drills', 'Caries-Free'].map((l, i) => {
                const keys = ['enrollment', 'schoolsVisited', 'healthTalks', 'toothbrushingDrills', 'cariesFree'];
                return (
                    <div key={i} style={{ ...kpiCard, gridColumn: 'span 2' }}>
                        <span style={kpiLabel}>{l}</span>
                        <div style={kpiVal}>{sumVal(keys[i]).toLocaleString()}</div>
                    </div>
                );
            })}

            {/* MAIN INDICES BAR CHART */}
            <div style={{ ...chartContainer, gridColumn: 'span 8' }}>
                <h4 style={chartTitle}>Dental Health Indices: {selectedDivision}</h4>
                <div style={chartWrapper}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[{ name: activeTab, D: sumVal('dmft_D'), M: sumVal('dmft_M'), F: sumVal('dmft_F'), ST: sumVal('perm_ST') }]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                            <XAxis dataKey="name" stroke="#0f172a" fontWeight="800" />
                            <YAxis stroke="#0f172a" fontWeight="800" />
                            <Tooltip />
                            <Legend iconType="circle" />
                            <Bar name="Decayed (D)" dataKey="D" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            <Bar name="Missing (M)" dataKey="M" fill="#64748b" radius={[4, 4, 0, 0]} />
                            <Bar name="Filled (F)" dataKey="F" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar name="ST Teeth" dataKey="ST" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* PIE CHART - DISTRIBUTION */}
            <div style={{ ...chartContainer, gridColumn: 'span 4' }}>
                <h4 style={chartTitle}>Condition Share</h4>
                <div style={chartWrapper}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={teethIndicesData} 
                                innerRadius={60} 
                                outerRadius={80} 
                                paddingAngle={5} 
                                dataKey="value"
                            >
                                {teethIndicesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend layout="vertical" verticalAlign="bottom" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* SERVICES RENDERED SUMMARY */}
            <div style={{ ...chartContainer, gridColumn: 'span 12' }}>
                <h4 style={chartTitle}>Clinical Services Coverage (Target: {sumVal('enrollment').toLocaleString()} children)</h4>
                <div style={{ ...chartWrapper, height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={servicesData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                            <XAxis type="number" stroke="#0f172a" />
                            <YAxis type="category" dataKey="name" stroke="#0f172a" fontWeight="800" width={80} />
                            <Tooltip />
                            <Bar name="Total Rendered" dataKey="count" fill="#1e3a8a" radius={[0, 4, 4, 0]} barSize={25} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// --- STYLES (MATCHING YOUR UI) ---
const kpiCard = { background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '2px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const kpiLabel = { fontSize: '10px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase' };
const kpiVal = { fontSize: '26px', fontWeight: '900', color: '#1e3a8a', marginTop: '5px' };
const chartContainer = { background: '#fff', padding: '25px', borderRadius: '16px', border: '2px solid #cbd5e1' };
const chartTitle = { margin: '0 0 15px 0', fontSize: '12px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' };
const chartWrapper = { height: '350px', background: '#fff', borderRadius: '12px', padding: '10px' };

export default MdnsAnalytics;