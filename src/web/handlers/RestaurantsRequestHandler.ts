import Restaurant from '../../models/Restaurant';
import RequestHandler from './RequestHandler';

class RestaurantsRequestHandler extends RequestHandler {

  create = this.handle(async (req, _) => {

    const created = await Restaurant.create(req.body);

    return this.mapDocument(created);
  });

  list = this.handle(async (req, _) => {

    const findQuery = Restaurant.find(this.filters(req, { like: ['name'] }))
    const paginateQuery = this.paginate(req, findQuery)
    const restaurants = await paginateQuery.lean()

    return restaurants.map(this.mapJSON);
  })
}

export default RestaurantsRequestHandler