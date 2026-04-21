const Supplier = require('../models/Supplier');

// Get all regional data
exports.getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().sort({ division: 1 });
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create or Update a specific division's data
exports.updateSupplier = async (req, res) => {
    const { division, nfp, milk, sl } = req.body;
    try {
        const updated = await Supplier.findOneAndUpdate(
            { division },
            { nfp, milk, sl },
            { upsert: true, new: true }
        );
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};                                                                                                                                                                                                                                                                                                                      