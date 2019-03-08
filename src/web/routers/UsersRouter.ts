import { Router } from "express";
import bcrypt from 'bcrypt'
import Repository from "../../repository/Repository";
import ExpressRequestBodyValidator, { Type } from "../core/ExpressRequestBodyValidator";

export default (repository: Repository) => {

  const router = Router()

  router.post('/', async (req, res) => {

    const validator = new ExpressRequestBodyValidator(req, {
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

    try {
      await validator.validate()
    } catch (e) {
      res.status(422)
      res.json({ errors: e })
      return
    }

    const password = req.body.password

    const saltedPassword = await bcrypt.hash(password, 10)

    const created = await repository.create({ ...req.body, password: saltedPassword })

    res.json(created)
  })

  return router
}