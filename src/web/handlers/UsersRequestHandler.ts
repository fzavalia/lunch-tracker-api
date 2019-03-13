import User from '../../models/User';
import RequestHandler from './RequestHandler';
import { ExpressRequestBodyValidatorTypes } from '../core/ExpressRequestBodyValidator';
import Auth from '../core/Auth';

class UsersRequestHandler extends RequestHandler {

  constructor(private auth: Auth) {
    super()
  }

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
    const salted = await this.auth.saltPassword(password)
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

    this.auth.comparePasswordToHash(req.body.password, user.password)

    user = this.mapJSON(user)
    delete user.password
    const token = this.auth.makeToken(user)

    return { user, token };
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