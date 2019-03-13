import express, { Router, Express, Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose'
import UsersRequestHandler from './handlers/UsersRequestHandler';
import RestaurantsRequestHandler from './handlers/RestaurantsRequestHandler';
import BudgetsRequestHandler from './handlers/BudgetsRequestHandler';
import ExpensesRequestHandler from './handlers/ExpensesRequestHandler';
import connectDB from './core/connectDB';
import Auth from './core/Auth';

export default async (port: number, dbHost: string, secret: string) => {

  connectDB(dbHost)

  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(morgan('tiny'))
  app.use(cors())

  const auth = new Auth(secret)

  bindHealthEndpoint(app)
  bindUsersRequestHandlerToApp(app, auth)
  bindBudgetsRequestHandlerToApp(app, auth)
  bindRestaurantsRequestHandlerToApp(app, auth)
  bindExpensesRequestHandlerToApp(app, auth)

  app.listen(port, () => console.log(`Listening on port ${port}`))
}

const bindHealthEndpoint = (app: Express) => {
  app.get('/', (_, res) => res.redirect('/health'))
  app.get('/health', (_, res) => {
    const status = mongoose.connection.readyState === 0 ? 500 : 200
    res.status(status)
    res.send()
  })
}

const bindUsersRequestHandlerToApp = (app: Express, auth: Auth) => {
  const handler = new UsersRequestHandler(auth)
  app.get('/users', handler.list)
  app.get('/users/:id', handler.show)
  app.post('/users', handler.create)
  app.post('/users/login', handler.login)
}

const bindRestaurantsRequestHandlerToApp = (app: Express, auth: Auth) => {
  const handler = new RestaurantsRequestHandler()
  app.get('/restaurants', auth.middleware, handler.list)
  app.post('/restaurants', auth.middleware, handler.create)
}

const bindBudgetsRequestHandlerToApp = (app: Express, auth: Auth) => {
  const handler = new BudgetsRequestHandler()
  app.get('/budgets', auth.middleware, handler.list)
  app.post('/budgets', auth.middleware, handler.create)
}

const bindExpensesRequestHandlerToApp = (app: Express, auth: Auth) => {
  const handler = new ExpensesRequestHandler()
  app.get('/expenses/year/:year/month/:month', auth.middleware, handler.listForMonth)
  app.get('/expenses/year/:year/month/:month/spent', auth.middleware, handler.spentOnMonth)
  app.get('/expenses/year/:year', auth.middleware, handler.listForYear)
  app.get('/expenses/year/:year/spent', auth.middleware, handler.spentOnYear)
  app.post('/expenses', auth.middleware, handler.create)
}
