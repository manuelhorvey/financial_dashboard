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
  customCreatedAt: { 
    type: Date,
  },
}, { timestamps: true });

// Pre-save middleware to set customCreatedAt to the same as startDate during document creation
StatementSchema.pre('save', function(next) {
  if (!this.customCreatedAt) {
    this.customCreatedAt = this.startDate;
  }
  next();
});

// Pre-update middleware to set startDate to customCreatedAt during updates
StatementSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();

  if (update.customCreatedAt) {
    update.startDate = update.customCreatedAt;
  }

  next();
});

module.exports = mongoose.models.Statement || mongoose.model('Statement', StatementSchema);
