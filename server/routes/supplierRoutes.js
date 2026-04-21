const express = require('express');
const router = express.Router();
const { getSuppliers, updateSupplier } = require('../controllers/supplierController');

router.get('/', getSuppliers);
router.post('/update', updateSupplier);

module.exports = router;