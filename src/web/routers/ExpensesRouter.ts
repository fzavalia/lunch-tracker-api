import { Router, Request, Response } from "express";
import moment from 'moment'
import Repository from "../../repository/Repository";
import { ExpressRequestBodyValidatorTypes } from "../core/ExpressRequestBodyValidator";
import makeRouterHandler, { RouterHandlerOptions } from "../core/makeRouterHandler";

export default (repository: Repository) => {

  const router = Router()

  const createExpenseHandler = async (req: Request, res: Response) => {

    let date: Date

    if (!req.body.date) {
      date = new Date();
    } else {
      date = moment(req.body.date).toDate()
    }

    const created = await repository.create({ ...req.body, date, user: req.body.user })

    res.json(created)
  }

  const createExpenseOptions: RouterHandlerOptions = {
    validation: {
      restaurant: {
        type: ExpressRequestBodyValidatorTypes.String,
      },
      amount: {
        type: ExpressRequestBodyValidatorTypes.Number,
        required: true,
      },
      user: {
        type: ExpressRequestBodyValidatorTypes.String,
        required: true,
      },
      date: {
        type: ExpressRequestBodyValidatorTypes.Date,
      }
    }
  }

  router.post('/', makeRouterHandler(createExpenseHandler, createExpenseOptions))

  return router
}