import { Request, Response } from 'express';
import Expense from '../../models/Expense';
import RequestHandler from './RequestHandler';
import moment from 'moment';
import { months } from '../../constants';

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

  listForMonth = async (req: Request, res: Response) => {
    try {

      const { year, month } = req.params

      const gteDate = moment([year, months.indexOf(month)]).toDate()
      const lteDate = moment(gteDate).add(1, 'month').toDate()

      const findQuery = Expense.find({ ...this.filters(req, { exact: ['user'] }), date: { $gte: gteDate, $lte: lteDate } })
      const paginateQuery = this.paginate(req, findQuery)
      const expenses = await paginateQuery.lean()

      res.send(expenses.map(this.mapJSON))
    }
    catch (e) {
      res.status(500);
      res.send(e);
    }
  }

  listForYear = async (req: Request, res: Response) => {
    try {

      const { year } = req.params

      const gteDate = moment([year]).toDate()
      const lteDate = moment(gteDate).add(1, 'year').toDate()

      const findQuery = Expense.find({ ...this.filters(req, { exact: ['user'] }), date: { $gte: gteDate, $lte: lteDate } })
      const paginateQuery = this.paginate(req, findQuery)
      const expenses = await paginateQuery.lean()

      res.send(expenses.map(this.mapJSON))
    }
    catch (e) {
      res.status(500);
      res.send(e);
    }
  }

  spentOnMonth = async (req: Request, res: Response) => {
    try {

      const { year, month } = req.params

      const gteDate = moment([year, months.indexOf(month)]).toDate()
      const lteDate = moment(gteDate).add(1, 'month').toDate()

      const findQuery = Expense.find({ ...this.filters(req, { exact: ['user'] }), date: { $gte: gteDate, $lte: lteDate } })
      const expenses: any[] = await findQuery.lean()
      const spent = expenses.reduce((acc, next) => acc + next.amount, 0)

      res.send({ value: spent })
    }
    catch (e) {
      res.status(500);
      res.send(e);
    }
  }

  spentOnYear = async (req: Request, res: Response) => {
    try {

      const { year } = req.params

      const gteDate = moment([year]).toDate()
      const lteDate = moment(gteDate).add(1, 'year').toDate()

      const findQuery = Expense.find({ ...this.filters(req, { exact: ['user'] }), date: { $gte: gteDate, $lte: lteDate } })
      const expenses: any[] = await findQuery.lean()
      const spent = expenses.reduce((acc, next) => acc + next.amount, 0)

      res.send({ value: spent })
    }
    catch (e) {
      res.status(500);
      res.send(e);
    }
  }
}

export default ExpensesRequestHandler