import { Request, Response } from 'express';
import Budget from '../../models/Budget';
import { isNullOrUndefined } from 'util';

class BudgetsRequestHandler {

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
      const { page, perPage, ...filters } = req.query
      if (isNullOrUndefined(page) || isNullOrUndefined(perPage)) {
        throw {
          message: 'page and perPage query params not present',
          name: 'Pagination Error'
        }
      }
      const budgets = await Budget.find(filters).skip((page - 1) * perPage).limit(parseInt(perPage));
      res.send(budgets);
    }
    catch (e) {
      res.status(500);
      res.send(e);
    }
  }
}



export default BudgetsRequestHandler