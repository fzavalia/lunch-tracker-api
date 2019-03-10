import { Request, Response } from 'express';
import Expense from '../../models/Expense';
import RequestHandler from './RequestHandler';

class ExpensesRequestHandler extends RequestHandler {
  create = async (req: Request, res: Response) => {
    try {
      const created = await Expense.create(req.body);
      res.send(this.mapDocument(created));
    }
    catch (e) {
      res.status(500);
      res.send(e);
    }
  };
}

export default ExpensesRequestHandler