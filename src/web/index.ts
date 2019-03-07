import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan';
import mongoose from 'mongoose'
import UsersRouter from './routers/UsersRouter';
import MongooseRepository from '../repository/MongooseRepository';
import User from '../models/User';

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
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(morgan('tiny'))

  app.get('/', (_, res) => res.send('ok'))

  app.use('/users', UsersRouter(new MongooseRepository(User)))

  app.listen(config.port, () => console.log(`Listening on port ${config.port}`))
}