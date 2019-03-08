import { Request, Response } from 'express';
import Restaurant from '../../models/Restaurant';

class RestaurantsRequestHandler {
  create = async (req: Request, res: Response) => {
    try {
      const created = await Restaurant.create(req.body);
      res.send(created);
    }
    catch (e) {
      res.status(500);
      res.send(e);
    }
  };
}

export default RestaurantsRequestHandler