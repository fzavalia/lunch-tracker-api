import { Request, Response } from 'express';
import Restaurant from '../../models/Restaurant';
import RequestHandler from './RequestHandler';

class RestaurantsRequestHandler extends RequestHandler {

  create = async (req: Request, res: Response) => {
    try {
      const created = await Restaurant.create(req.body);
      res.send(this.mapDocument(created));
    }
    catch (e) {
      res.status(500);
      res.send(e);
    }
  };

  list = async (req: Request, res: Response) => {
    try {
      const findQuery = Restaurant.find(this.filters(req, { like: ['name'] }))
      const paginateQuery = this.paginate(req, findQuery)
      const restaurants = await paginateQuery.lean()
      res.send(restaurants.map(this.mapJSON));
    }
    catch (e) {
      res.status(500);
      res.send(e);
    }
  }
}

export default RestaurantsRequestHandler