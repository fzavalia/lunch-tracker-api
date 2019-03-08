import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  month: {
    type: [String],
    enum: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  expenses: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Expense'
  }
})

export default mongoose.model('Budget', schema)