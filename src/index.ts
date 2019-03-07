import web from './web'

web({
  port: 8000,
  db: {
    host: 'mongodb://192.168.99.101:27017',
    name: 'db',
    pass: 'example',
    user: 'root'
  }
})