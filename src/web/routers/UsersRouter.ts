import { Router, Request } from "express";
import bcrypt from 'bcrypt'
import Repository from "../../repository/Repository";
import { isNullOrUndefined } from "util";

export default (repository: Repository) => {

  const router = Router()

  router.post('/', async (req, res) => {

    const validator = new ExpressRequestBodyValidator(req, {
      name: {
        type: 'string',
        required: true
      },
      email: {
        type: 'email',
        required: true,
      },
      password: {
        type: 'string',
        required: true
      }
    })
    
    try {
      await validator.validate()
    } catch(e) {
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

interface Schema {
  [prop: string]: {
    type: string,
    required?: boolean,
  }
}

class ExpressRequestBodyValidator {

  constructor(private request: Request, private schema: Schema) { }

  validate = () => new Promise((resolve, reject) => {

    const errors = Object.keys(this.schema).reduce((errors: string[], propName) => {

      const propValidations = this.schema[propName]

      const propToValidate = this.request.body[propName]

      if (propValidations.required && isNullOrUndefined(propToValidate)) {
        return errors.concat(`${propName} is required`)
      }

      switch (propValidations.type) {
        case 'number':
          if (isNaN(propToValidate)) {
            return errors.concat(`${propName} has to be numeric`)
          }
          break
        case 'string':
          if (typeof propToValidate !== 'string') {
            return errors.concat(`${propName} has to be a string`)
          }
          if (propToValidate.length === 0) {
            return errors.concat(`${propName} cannot be an empty string`)
          }
          break
        case 'email':
          if (!this.isEmail(propToValidate)) {
            return errors.concat(`${propName} has to be an email`)
          }
          break
      }

      return errors
    }, [])

    if (errors.length > 0) {
      reject(errors)
    } else {
      resolve()
    }
  })

  private isEmail = (email: string) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}