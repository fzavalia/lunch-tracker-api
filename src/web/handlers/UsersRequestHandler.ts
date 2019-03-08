import { Request, Response } from 'express';
import User from '../../models/User';

class UsersRequestHandler {
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
}

export default UsersRequestHandler