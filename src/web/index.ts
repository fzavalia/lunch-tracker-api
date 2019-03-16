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
import TokensRequestHandler from './handlers/TokensRequestHandler';

export default async (dbHost: string, secret: string, password: string) => {

  const port = 8000

  connectDB(dbHost)

  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(morgan('tiny'))
  app.use(cors())

  const token = Token.withSecret(secret)
  const authHandler = new AuthMiddleware(token).handler

  bindHealthEndpoint(app)
  bindTokensRequestHandler(app, token, password)
  bindUsersRequestHandlerToApp(app, authHandler)
  bindBudgetsRequestHandlerToApp(app, authHandler)
  bindRestaurantsRequestHandlerToApp(app, authHandler)
  bindExpensesRequestHandlerToApp(app, authHandler)

  app.listen(port, () => console.log(`Listening on port ${port}`))
}

const bindHealthEndpoint = (app: Express) => {
  app.get('/health', (_, res) => {
    const status = mongoose.connection.readyState === 0 ? 500 : 200
    res.status(status)
    res.send()
  })
}

const bindTokensRequestHandler = (app: Express, token: Token, password: string) => {
  const handler = new TokensRequestHandler(token, password)
  app.get('/tokens/:token/valid', handler.isValid)
  app.post('/tokens', handler.create)
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
  app.delete('/expenses/:id', authHandler, handler.delete)
}