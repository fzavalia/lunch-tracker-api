import mongoose from 'mongoose'

export interface DBConfig {
  host: string,
  user: string,
  pass: string,
  name: string
}

const connectDB = (config: DBConfig) => {

  mongoose.set('useCreateIndex', true)

  console.log('Connecting to DB')

  mongoose.connect(
    config.host,
    {
      user: config.user,
      pass: config.pass,
      dbName: config.name,
      useNewUrlParser: true
    },
  )

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