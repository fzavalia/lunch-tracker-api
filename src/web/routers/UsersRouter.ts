import { Router } from "express";
import bcrypt from 'bcrypt'
import Repository from "../../repository/Repository";

export default (repository: Repository) => {

  const router = Router()

  router.post('/', async (req, res) => {

    const password = req.body.password

    const saltedPassword = await bcrypt.hash(password, 10)

    const created = await repository.create({ ...req.body, password: saltedPassword })

    res.send(created)
  })

  return router
}