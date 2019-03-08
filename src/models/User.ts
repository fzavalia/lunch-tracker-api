import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  expenses: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Expense'
  }
})

export default mongoose.model('User', schema)