import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  amount: Number,
  date: Date,
  restaurant: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
})

export default mongoose.model('User', schema)