import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  }
})

export default mongoose.model('Restaurant', schema)