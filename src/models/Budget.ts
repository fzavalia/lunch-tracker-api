import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  amount: Number,
  date: Date,
  month: {
    type: [Number],
    enum: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
  }
})

export default mongoose.model('Budget', schema)