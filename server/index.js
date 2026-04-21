const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 🚀 1. Import Routes
const recordRoutes = require('./routes/mdnsRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const winsRoutes = require('./routes/winsRoutes'); // Added WinS Route

// 🚀 2. Use Routes
app.use('/api/records', recordRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/wins', winsRoutes); // Mounted WinS API

// Removed duplicate mdnsRoutes import for better performance

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Local MongoDB Connected"))
  .catch(err => console.log("❌ DB Connection Error:", err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));