import { Router, Request, Response } from "express";
import bcrypt from 'bcrypt'
import Repository from "../../repository/Repository";
import { ExpressRequestBodyValidatorTypes } from "../core/ExpressRequestBodyValidator";
import makeRouterHandler, { RouterHandlerOptions } from "../core/makeRouterHandler";

export default (repository: Repository) => {

  const router = Router()

  const createUserHandler = async (req: Request, res: Response) => {

    const password = req.body.password
    const saltedPassword = await bcrypt.hash(password, 10)
    const created = await repository.create({ ...req.body, password: saltedPassword })

    res.json(created)
  }

  const createUserOptions: RouterHandlerOptions = {
    validation: {
      name: {
        type: ExpressRequestBodyValidatorTypes.String,
        required: true
      },
      email: {
        type: ExpressRequestBodyValidatorTypes.Email,
        required: true,
      },
      password: {
        type: ExpressRequestBodyValidatorTypes.String,
        required: true
      }
    }
  }

  router.post('/', makeRouterHandler(createUserHandler, createUserOptions))

  return router
}