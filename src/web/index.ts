import express, { Router, Express } from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose'
import UsersRequestHandler from './handlers/UsersRequestHandler';
import RestaurantsRequestHandler from './handlers/RestaurantsRequestHandler';
import BudgetsRequestHandler from './handlers/BudgetsRequestHandler';
import ExpensesRequestHandler from './handlers/ExpensesRequestHandler';
import connectDB from './core/connectDB';

export default async (port: number, dbHost: string, secret: string) => {

  connectDB(dbHost)

  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(morgan('tiny'))
  app.use(cors())

  bindHealthEndpoint(app)
  bindUsersRequestHandlerToApp(app, secret)
  bindBudgetsRequestHandlerToApp(app)
  bindRestaurantsRequestHandlerToApp(app)
  bindExpensesRequestHandlerToApp(app)

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

const bindUsersRequestHandlerToApp = (app: Express, secret: string) => {
  const usersRequestHandler = new UsersRequestHandler(secret)
  app.get('/users', usersRequestHandler.list)
  app.get('/users/:id', usersRequestHandler.show)
  app.post('/users', usersRequestHandler.create)
  app.post('/users/login', usersRequestHandler.login)
}

const bindRestaurantsRequestHandlerToApp = (app: Express) => {
  const restaurantRequestHandler = new RestaurantsRequestHandler()
  app.get('/restaurants', restaurantRequestHandler.list)
  app.post('/restaurants', restaurantRequestHandler.create)
}

const bindBudgetsRequestHandlerToApp = (app: Express) => {
  const budgetsRequestHandler = new BudgetsRequestHandler()
  app.get('/budgets', budgetsRequestHandler.list)
  app.post('/budgets', budgetsRequestHandler.create)
}

const bindExpensesRequestHandlerToApp = (app: Express) => {
  const expensesRequestHandler = new ExpensesRequestHandler()
  app.get('/expenses/year/:year/month/:month', expensesRequestHandler.listForMonth)
  app.get('/expenses/year/:year/month/:month/spent', expensesRequestHandler.spentOnMonth)
  app.get('/expenses/year/:year', expensesRequestHandler.listForYear)
  app.get('/expenses/year/:year/spent', expensesRequestHandler.spentOnYear)
  app.post('/expenses', expensesRequestHandler.create)
}
