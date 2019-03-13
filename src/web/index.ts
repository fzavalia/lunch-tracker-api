import express, { Express, NextFunction, Response, Request, RequestHandler } from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose'
import UsersRequestHandler from './handlers/UsersRequestHandler';
import RestaurantsRequestHandler from './handlers/RestaurantsRequestHandler';
import BudgetsRequestHandler from './handlers/BudgetsRequestHandler';
import ExpensesRequestHandler from './handlers/ExpensesRequestHandler';
import connectDB from './core/connectDB';
import Token from './core/Token';
import AuthMiddleware from './middlewares/AuthMiddleware';

export default async (port: number, dbHost: string, secret: string) => {

  connectDB(dbHost)

  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(morgan('tiny'))
  app.use(cors())

  const authHandler = new AuthMiddleware(Token.withSecret(secret)).handler

  bindHealthEndpoint(app)
  bindUsersRequestHandlerToApp(app, authHandler)
  bindBudgetsRequestHandlerToApp(app, authHandler)
  bindRestaurantsRequestHandlerToApp(app, authHandler)
  bindExpensesRequestHandlerToApp(app, authHandler)

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

const bindUsersRequestHandlerToApp = (app: Express, authHandler: RequestHandler) => {
  const handler = new UsersRequestHandler()
  app.get('/users', handler.list)
  app.get('/users/:id', handler.show)
  app.post('/users', authHandler, handler.create)
}

const bindRestaurantsRequestHandlerToApp = (app: Express, authHandler: RequestHandler) => {
  const handler = new RestaurantsRequestHandler()
  app.get('/restaurants', handler.list)
  app.post('/restaurants', authHandler, handler.create)
}

const bindBudgetsRequestHandlerToApp = (app: Express, authHandler: RequestHandler) => {
  const handler = new BudgetsRequestHandler()
  app.get('/budgets', handler.list)
  app.post('/budgets', authHandler, handler.create)
}

const bindExpensesRequestHandlerToApp = (app: Express, authHandler: RequestHandler) => {
  const handler = new ExpensesRequestHandler()
  app.get('/expenses/year/:year/month/:month', handler.listForMonth)
  app.get('/expenses/year/:year/month/:month/spent', handler.spentOnMonth)
  app.get('/expenses/year/:year', handler.listForYear)
  app.get('/expenses/year/:year/spent', handler.spentOnYear)
  app.post('/expenses', authHandler, handler.create)
}