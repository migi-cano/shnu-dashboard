import React from 'react';
import axios from 'axios';

const SupplierEditPayments = ({ selectedDO, data, setData, onClose }) => {
    const handleUpdate = async (type, index) => {
        console.log('handleUpdate clicked - type:', type, 'index:', index);
        const input = document.getElementById(`pay-${type}-${index}`);
        const val = Number(input.value);
        console.log('Payment amount:', val);
        if (!val) {
            console.log('Invalid amount, returning');
            return;
        }

        // 1. Create a DEEP copy of the selected division with updated cumulative
        const updatedDivision = {
            ...selectedDO,
            [type]: selectedDO[type].map((item, i) =>
                i === index
                    ? { ...item, cumulative: item.cumulative + val }
                    : item
            )
        };
        console.log('Updated division:', updatedDivision);

        // 2. ⚠️ THIS IS THE PART THAT SAVES TO DB
        try {
            console.log('Sending POST request to http://localhost:5000/api/suppliers/update');
            const response = await axios.post('http://localhost:5000/api/suppliers/update', updatedDivision);
            console.log('Success response:', response);

            // 3. Update the UI state with the clean updated data
            setData(prevData => prevData.map(d =>
                d.division === selectedDO.division ? response.data : d
            ));

            input.value = '';
            alert("Payment saved to database!");
        } catch (err) {
            console.error('Save error - Status:', err.response?.status);
            console.error('Error response:', err.response?.data);
            console.error('Full error:', err.message);
            alert("Failed to save payment: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <>
            <div onClick={onClose} style={backdrop} />
            <div style={largeDrawer}>
                <div style={{ ...header, background: '#7c2d12' }}>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>POST PAYMENT: {selectedDO.division}</h3>
                    <button onClick={onClose} style={closeX}>×</button>
                </div>
                <div style={scrollArea} className="custom-scroll">
                    {['nfp', 'milk'].map(type => (
                        <div key={type} style={{ marginBottom: '30px' }}>
                            <h4 style={subT}>{type.toUpperCase()} COMPONENT</h4>
                            {selectedDO[type].map((p, i) => (
                                <div key={i} style={card}>
                                    <div style={{ fontWeight: '800', fontSize: '12px' }}>{p.payee}</div>
                                    <div style={{ fontSize: '10px', color: '#64748b', margin: '5px 0' }}>Current Paid: ₱{p.cumulative.toLocaleString()}</div>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <input type="number" id={`pay-${type}-${i}`} placeholder="Payment Amount" style={inp} />
                                        <button onClick={() => handleUpdate(type, i)} style={addB}>POST</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <style>{`.custom-scroll::-webkit-scrollbar { width: 5px; } .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }`}</style>
        </>
    );
};

const backdrop = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 999 };
const largeDrawer = { position: 'fixed', top: 0, right: 0, width: '480px', height: '100vh', background: '#fff', zIndex: 1000, display: 'flex', flexDirection: 'column' };
const header = { padding: '25px', color: '#fff', display: 'flex', justifyContent: 'space-between' };
const scrollArea = { flex: 1, padding: '30px', overflowY: 'auto' };
const card = { padding: '15px', border: '1px solid #cbd5e1', borderRadius: '8px', marginBottom: '15px' };
const inp = { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' };
const addB = { padding: '10px 20px', background: '#7c2d12', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '800', fontSize: '10px', cursor: 'pointer' };
const subT = { fontSize: '10px', fontWeight: '800', color: '#7c2d12', borderBottom: '2px solid #7c2d12', paddingBottom: '3px', marginBottom: '15px' };
const closeX = { border: 'none', background: 'transparent', color: '#fff', fontSize: '24px', cursor: 'pointer' };

export default SupplierEditPayments;