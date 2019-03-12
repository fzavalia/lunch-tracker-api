import web from './web'

const port = process.env.PORT ? parseInt(process.env.PORT) : 8000
const dbHost = process.env.DB_HOST || 'mongodb://root:example@127.0.0.1:27017/db?retryWrites=true&authSource=admin'

web(port, dbHost)