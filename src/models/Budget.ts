import mongoose from 'mongoose'
import { months } from '../constants';

const schema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  month: {
    type: String,
    enum: months,
    required: true
  },
  year: {
    type: Number,
    required: true
  }
})

schema.index({ month: 1, year: 1}, { unique: true })

export default mongoose.model('Budget', schema)