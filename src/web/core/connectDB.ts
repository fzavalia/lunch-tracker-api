import mongoose from 'mongoose'

const connectDB = (host: string) => {

  mongoose.set('useCreateIndex', true)

  console.log('Connecting to DB')

  mongoose.connect(host, { useNewUrlParser: true })

  mongoose.connection.on('connected', () => console.log('Connected to DB'))
  mongoose.connection.on('disconnected', () => console.log('Disconnected from DB'))
  mongoose.connection.on('error', () => console.log('Could not connect to DB'))

  process.on('SIGINT', async () => {
    await mongoose.connection.close()
    console.log('mongoose disconnected')
    process.exit(0)
  })
}

export default connectDB