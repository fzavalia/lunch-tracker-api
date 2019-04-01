import web from './web'

const dbHost = process.env.DB_HOST || 'mongodb://root:example@localhost:27017/db?retryWrites=true&authSource=admin'
const secret = process.env.SECRET || 'E6LQLAJat73PqNgwiuFgWGpyAJZFW1xhjiWSGcTvd2fvf3coxUPNMVBpMZx3Swd'
const password = process.env.PASSWORD || '12341234'
const port = process.env.PORT ? parseInt(process.env.PORT) : 8000

web(dbHost, secret, password, port)