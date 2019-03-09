import { Request, Response } from 'express';
import User from '../../models/User';
import RequestHandler from './RequestHandler';

class UsersRequestHandler extends RequestHandler {

  create = async (req: Request, res: Response) => {
    try {

      const created = await User.create(req.body);
      res.send(created);

    }
    catch (e) {

      res.status(500);
      res.send(e);

    }
  };

  list = async (req: Request, res: Response) => {
    try {

      const findQuery = User.find(this.filters(req, { exact: ['name'] }))
      const paginateQuery = this.paginate(req, findQuery)
      const users = await paginateQuery

      res.send(users)
    }
    catch (e) {

      res.status(500);
      res.send(e);

    }
  }
}

export default UsersRequestHandler