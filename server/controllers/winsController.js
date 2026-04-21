const Wins = require('../models/Wins');

exports.getWins = async (req, res) => {
  try {
    const data = await Wins.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.saveWins = async (req, res) => {
  try {
    const newEntry = new Wins(req.body);
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};