import User from '../../models/User';
import RequestHandler from './RequestHandler';
import bcrypt from 'bcrypt'
import { ExpressRequestBodyValidatorTypes } from '../core/ExpressRequestBodyValidator';
import jwt from 'jsonwebtoken'

const secret = 'nPCeQXbgyFqiBzEpAqlVEqOLubfpigPNYfAQhK32OMdqTrcsreLuyeh8wMBmalI'

class UsersRequestHandler extends RequestHandler {

  create = this.handle(async (req, _) => {

    this.validate(req, {
      name: {
        type: ExpressRequestBodyValidatorTypes.String,
        required: true
      },
      password: {
        type: ExpressRequestBodyValidatorTypes.String,
        required: true
      },
      email: {
        type: ExpressRequestBodyValidatorTypes.Email,
        required: true
      }
    })

    const password = req.body.password
    const salted = await bcrypt.hash(password, 10)
    const data = { ...req.body, password: salted }
    const created = await User.create(data);

    return this.mapDocument(created);
  });

  login = this.handle(async (req, _) => {

    this.validate(req, {
      password: {
        type: ExpressRequestBodyValidatorTypes.String,
        required: true
      },
      email: {
        type: ExpressRequestBodyValidatorTypes.Email,
        required: true
      }
    })

    let user = await User.findOne({ email: req.body.email }).orFail().lean()
    const match = await bcrypt.compare(req.body.password, user.password)

    if (!match) {
      throw {
        message: 'Invalid Password',
        name: 'InvalidPassword'
      }
    }

    user = this.mapJSON(user)
    delete user.password
    const signingKey = jwt.sign(user, secret)

    return {
      user,
      signingKey
    };
  });

  show = this.handle(async (req, _) => {

    const user = await User.findById(req.params.id).orFail().lean()

    return this.mapJSON(user)
  })

  list = this.handle(async (req, _) => {

    const findQuery = User.find(this.filters(req, { exact: ['name'] }))
    const paginateQuery = this.paginate(req, findQuery)
    const users = await paginateQuery.lean()

    return users.map(this.mapJSON)
  })
}

export default UsersRequestHandler