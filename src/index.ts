import web from './web'

const dbHost = process.env.DB_HOST || 'mongodb://root:example@192.168.99.101:27017/db?retryWrites=true&authSource=admin'
const secret = process.env.SECRET || 'E6LQLAJat73PqNgwiuFgWGpyAJZFW1xhjiWSGcTvd2fvf3coxUPNMVBpMZx3Swd'
const password = process.env.PASSWORD || '12341234'

web(dbHost, secret, password)