const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// GET all records (For your Graphs)
router.get('/', async (req, res) => {
  try {
    const records = await Record.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new record (For your Input Form)
router.post('/', async (req, res) => {
  // This version accepts the entire object from your React form
  const record = new Record(req.body);

  try {
    const newRecord = await record.save();
    res.status(201).json(newRecord);
  } catch (err) {
    console.error("❌ Save Error:", err.message);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;