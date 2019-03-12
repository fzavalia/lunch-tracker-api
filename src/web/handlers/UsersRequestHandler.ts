import User from '../../models/User';
import RequestHandler from './RequestHandler';
import bcrypt from 'bcrypt'
import { ExpressRequestBodyValidatorTypes } from '../core/ExpressRequestBodyValidator';

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