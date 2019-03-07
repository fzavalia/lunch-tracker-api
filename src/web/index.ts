import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan';
import mongoose from 'mongoose'
import CRUDRouter from './routers/CRUDRouter';
import User from '../models/User';
import Expense from '../models/Expense';
import Budget from '../models/Budget';

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

  await mongoose.connect(
    config.db.host, {
      user: config.db.user,
      pass: config.db.pass,
      dbName: config.db.name,
      useNewUrlParser: true
    })

  const app = express()

  app.use(bodyParser.json())

  app.use(morgan('tiny'))

  app.use('/users', CRUDRouter.fromScratch(User))

  app.use('/expenses', CRUDRouter.fromScratch(Expense))

  app.use('/budgets', CRUDRouter.fromScratch(Budget))

  app.listen(config.port, () => console.log(`Listening on port ${config.port}`))
}