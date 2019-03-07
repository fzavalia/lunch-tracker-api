import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  restaurant: String,
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
})

export default mongoose.model('expenses', schema)