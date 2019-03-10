import { Request, Response } from 'express';
import User from '../../models/User';
import RequestHandler from './RequestHandler';

class UsersRequestHandler extends RequestHandler {

  create = async (req: Request, res: Response) => {
    try {

      const created = await User.create(req.body);
      res.send(this.mapDocument(created));

    }
    catch (e) {

      res.status(500);
      res.send(e);

    }
  };

  show = async (req: Request, res: Response) => {
    try {

      const user = await User.findById(req.params.id).orFail().lean()
      res.send(this.mapJSON(user))

    }
    catch (e) {

      res.status(500);
      res.send(e);

    }
  }

  list = async (req: Request, res: Response) => {
    try {

      const findQuery = User.find(this.filters(req, { exact: ['name'] }))
      const paginateQuery = this.paginate(req, findQuery)
      const users = await paginateQuery.lean()

      res.send(users.map(this.mapJSON))

    }
    catch (e) {

      res.status(500);
      res.send(e);

    }
  }
}

export default UsersRequestHandler