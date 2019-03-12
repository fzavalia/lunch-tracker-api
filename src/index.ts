import web from './web'

web({
  port: process.env.PORT ? parseInt(process.env.PORT) : 8000,
  db: {
    host: process.env.DB_HOST || 'mongodb://localhost:27017',
    name: process.env.DB_NAME || 'db',
    pass: process.env.DB_PASS || 'example',
    user: process.env.DB_USER || 'root'
  }
})