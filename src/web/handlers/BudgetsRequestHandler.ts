import { Request, Response } from 'express';
import Budget from '../../models/Budget';
import RequestHandler from './RequestHandler';

class BudgetsRequestHandler extends RequestHandler {

  create = async (req: Request, res: Response) => {
    try {

      const created = await Budget.create(req.body);

      res.send(created);
    }
    catch (e) {

      res.status(500);
      res.send(e);

    }
  };

  list = async (req: Request, res: Response) => {
    try {

      const findQuery = Budget.find(this.filters(req, { exact: ['year', 'month'] }))
      const paginateQuery = this.paginate(req, findQuery)
      const budgets = await paginateQuery

      res.send(budgets);
    }
    catch (e) {

      res.status(500);
      res.send(e);

    }
  }
}



export default BudgetsRequestHandler