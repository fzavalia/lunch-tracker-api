import { Router, Request, Response } from "express";
import moment from 'moment'
import Repository from "../../repository/Repository";
import { ExpressRequestBodyValidatorTypes } from "../core/ExpressRequestBodyValidator";
import makeRouterHandler, { RouterHandlerOptions } from "../core/makeRouterHandler";

export default (repository: Repository) => {

  const router = Router()

  const createBudgetHandler = async (req: Request, res: Response) => {

    let date: Date

    if (!req.body.date) {
      date = new Date();
    } else {
      date = moment(req.body.date).toDate()
    }

    const created = await repository.create({ ...req.body, date })

    res.json(created)
  }

  const createBudgetOptions: RouterHandlerOptions = {
    validation: {
      amount: {
        type: ExpressRequestBodyValidatorTypes.Number,
        required: true,
      },
      date: {
        type: ExpressRequestBodyValidatorTypes.Date,
      },
      month: {
        type: ExpressRequestBodyValidatorTypes.String,
        required: true
      }
    }
  }

  router.post('/', makeRouterHandler(createBudgetHandler, createBudgetOptions))

  return router
}