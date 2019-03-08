import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan';
import mongoose from 'mongoose'
import UsersRouter from './routers/UsersRouter';
import MongooseRepository from '../repository/MongooseRepository';
import User from '../models/User';
import Expense from '../models/Expense';
import ExpensesRouter from './routers/ExpensesRouter';
import Budget from '../models/Budget';
import BudgetsRouter from './routers/BudgetsRouter';

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

  app.get('/', (_, res) => res.send('ok'))

  const users = new MongooseRepository(User)
  const expenses = new MongooseRepository(Expense)
  const budgets = new MongooseRepository(Budget)

  app.use('/users', UsersRouter(users))
  app.use('/expenses', ExpensesRouter(expenses))
  app.use('/budgets', BudgetsRouter(budgets))

  app.listen(port, () => console.log(`Listening on port ${port}`))
}