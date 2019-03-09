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

  app.get('/users', new UsersRequestHandler().list)
  app.post('/users', new UsersRequestHandler().create)

  app.post('/restaurants', new RestaurantsRequestHandler().create)

  app.get('/budgets', new BudgetsRequestHandler().list)
  app.post('/budgets', new BudgetsRequestHandler().create)
  
  app.post('/expenses', new ExpensesRequestHandler().create)

  app.listen(port, () => console.log(`Listening on port ${port}`))
}
