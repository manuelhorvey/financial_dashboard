const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  grossCommission: { type: Number, required: true },
  winsCommission: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);

module.exports = Client;
