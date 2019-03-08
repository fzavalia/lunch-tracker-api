import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  month: {
    type: [String],
    enum: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
    required: true
  }
})

export default mongoose.model('Budget', schema)