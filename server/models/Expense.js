const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    enum: ['oneTime', 'monthly', 'quarterly'],
    default: 'oneTime'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense; 