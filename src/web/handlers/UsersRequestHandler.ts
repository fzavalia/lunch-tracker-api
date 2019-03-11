import User from '../../models/User';
import RequestHandler from './RequestHandler';

class UsersRequestHandler extends RequestHandler {

  create = this.handle(async (req, _) => {

    const created = await User.create(req.body);

    this.mapDocument(created);
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