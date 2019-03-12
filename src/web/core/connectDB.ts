import mongoose from 'mongoose'

export interface DBConfig {
  host: string,
  user: string,
  pass: string,
  name: string
}

const connectDB = (config: DBConfig) => {

  mongoose.set('useCreateIndex', true)

  mongoose.connect(
    config.host,
    {
      user: config.user,
      pass: config.pass,
      dbName: config.name,
      useNewUrlParser: true
    },
  )

  process.on('SIGINT', async () => {
    await mongoose.connection.close()
    console.log('mongoose disconnected')
    process.exit(0)
  })
}

export default connectDB