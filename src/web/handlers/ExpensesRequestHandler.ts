import { Request, Response } from 'express';
import Expense from '../../models/Expense';

class ExpensesRequestHandler {
  create = async (req: Request, res: Response) => {
    try {
      const created = await Expense.create(req.body);
      res.send(created);
    }
    catch (e) {
      res.status(500);
      res.send(e);
    }
  };
}

export default ExpensesRequestHandler