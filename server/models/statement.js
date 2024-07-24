const mongoose = require('mongoose');

const StatementSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  clientLocation: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  books: {
    type: [Number],
    required: true,
    default: [0, 0, 0, 0, 0, 0, 0],
  },
  gross: {
    type: [Number],
    required: true,
    default: [0, 0, 0, 0, 0, 0, 0],
  },
  wins: {
    type: Number,
    required: true,
    default: 0,
  },
  prevbalOffice: {
    type: Number,
    required: true,
    default: 0,
  },
  cashOffice: {
    type: Number,
    required: true,
    default: 0,
  },
  prevbalClient: {
    type: Number,
    required: true,
    default: 0,
  },
  cashClient: {
    type: Number,
    required: true,
    default: 0,
  },
}, { timestamps: true });

// Exporting the model directly
module.exports = mongoose.models.Statement || mongoose.model('Statement', StatementSchema);
