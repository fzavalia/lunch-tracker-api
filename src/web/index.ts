import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose'
import UsersRequestHandler from './handlers/UsersRequestHandler';
import RestaurantsRequestHandler from './handlers/RestaurantsRequestHandler';
import BudgetsRequestHandler from './handlers/BudgetsRequestHandler';
import ExpensesRequestHandler from './handlers/ExpensesRequestHandler';

interface DBConfig {
  host: string,
  user: string,
  pass: string,
  name: string
}

interface Config {
  port: number
  db: DBConfig
}

export default async (config: Config) => {

  const { port, db } = config

  mongoose.set('useCreateIndex', true)

  await mongoose.connect(
    db.host,
    {
      user: db.user,
      pass: db.pass,
      dbName: db.name,
      useNewUrlParser: true
    }
  )

  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(morgan('tiny'))
  app.use(cors())

  app.get('/', (_, res) => res.send('ok'))

  const usersRequestHandler = new UsersRequestHandler()

  app.get('/users', usersRequestHandler.list)
  app.get('/users/:id', usersRequestHandler.show)
  app.post('/users', usersRequestHandler.create)

  const restaurantRequestHandler = new RestaurantsRequestHandler()

  app.post('/restaurants', restaurantRequestHandler.create)

  const budgetsRequestHandler = new BudgetsRequestHandler()

  app.get('/budgets', budgetsRequestHandler.list)
  app.post('/budgets', budgetsRequestHandler.create)

  const expensesRequestHandler = new ExpensesRequestHandler()
  
  app.post('/expenses', expensesRequestHandler.create)

  app.listen(port, () => console.log(`Listening on port ${port}`))
}
