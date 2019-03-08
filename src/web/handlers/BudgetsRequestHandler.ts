import { Request, Response } from 'express';
import Budget from '../../models/Budget';

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
}

export default BudgetsRequestHandler