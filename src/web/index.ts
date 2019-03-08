import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan';
import mongoose from 'mongoose'
import User from '../models/User';
import Budget from '../models/Budget';
import Restaurant from '../models/Restaurant';
import Expense from '../models/Expense';

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

  app.post('/users', async (req, res) => {
    try {
      const created = await User.create(req.body)
      res.send(created)
    } catch(e) {
      res.status(500)
      res.send(e)
    }
  })

  app.listen(port, () => console.log(`Listening on port ${port}`))
}