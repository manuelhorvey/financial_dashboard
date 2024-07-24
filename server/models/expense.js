const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  expense: { type: String, required: true },
  vendor: { type: String, required: true },
  details: { type: String, required: true },
  amount: { type: Number, required: true },
}, { timestamps: true });

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

module.exports = Expense;
