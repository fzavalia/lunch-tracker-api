import { Router as ExpressRouter, Request, Response } from "express";
import bcrypt from 'bcrypt'
import Repository from "../../repository/Repository";
import ExpressRequestBodyValidator, { Type, Schema } from "../core/ExpressRequestBodyValidator";

const validate = (req: Request, res: Response, schema: Schema) => {

  const validator = new ExpressRequestBodyValidator(req, schema)

  const errors = validator.validate()

  if (errors.length > 0) {

    res.status(422)
    res.json({ errors })

    return false
  }

  return true
}

export default (repository: Repository) => {

  const router = ExpressRouter()

  router.post('/', async (req, res) => {

    const valid = validate(req, res, {
      name: {
        type: Type.String,
        required: true
      },
      email: {
        type: Type.Email,
        required: true,
      },
      password: {
        type: Type.String,
        required: true
      }
    })

    if (!valid) return

    const password = req.body.password

    const saltedPassword = await bcrypt.hash(password, 10)

    const created = await repository.create({ ...req.body, password: saltedPassword })

    res.json(created)
  })

  return router
}