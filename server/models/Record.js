    const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  reportType: { type: String, required: true },
  location: { type: String, required: true },

  fillPFS: { type: Number, default: 0 },
  fillART: { type: Number, default: 0 },
  fillZOE: { type: Number, default: 0 },
  fillSYF: { type: Number, default: 0 },
  
  // Section 1 & 2: General & Children Counts
  enrollment: { type: Number, default: 0 },
  schoolsVisited: { type: Number, default: 0 },
  healthTalks: { type: Number, default: 0 },
  toothbrushingDrills: { type: Number, default: 0 },
  oralExam: { type: Number, default: 0 },
  cariesFree: { type: Number, default: 0 },
  treatedMeds: { type: Number, default: 0 },
  scalingPolishing: { type: Number, default: 0 },
  extractionDone: { type: Number, default: 0 },
  fillingDone: { type: Number, default: 0 },
  fluorideVarnish: { type: Number, default: 0 },
  healthSupplies: { type: Number, default: 0 },

  // Section 3: Procedures & Indices
  extPerm: { type: Number, default: 0 },
  extTemp: { type: Number, default: 0 },
  dmft_D: { type: Number, default: 0 },
  dmft_M: { type: Number, default: 0 },
  dmft_F: { type: Number, default: 0 },
  dmftTotal: { type: Number, default: 0 },
  temp_S: { type: Number, default: 0 },
  temp_d: { type: Number, default: 0 },
  temp_f: { type: Number, default: 0 },
  temp_s: { type: Number, default: 0 },

  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Record', RecordSchema);