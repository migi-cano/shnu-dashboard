const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
    division: { type: String, required: true, unique: true },
    nfp: [{
        payee: String,
        contract: { type: Number, default: 0 },
        cumulative: { type: Number, default: 0 },
        status: { type: String, default: 'Active' }
    }],
    milk: [{
        payee: String,
        contract: { type: Number, default: 0 },
        cumulative: { type: Number, default: 0 },
        status: { type: String, default: 'Active' }
    }],
    sl: {
        amount: { type: Number, default: 0 },
        status: { type: String, default: 'Pending' }
    }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', SupplierSchema);