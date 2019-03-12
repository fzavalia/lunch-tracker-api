import Expense from '../../models/Expense';
import RequestHandler from './RequestHandler';
import moment, { DurationInputArg2 } from 'moment';
import { months } from '../../constants';
import { DocumentQuery, Document } from 'mongoose';
import { Request } from 'express'

class ExpensesRequestHandler extends RequestHandler {

  create = this.handle(async (req, _) => {

    const created = await Expense.create(req.body);

    return this.mapDocument(created);
  });

  listForMonth = this.handle(async (req, _) => {

    const findQuery = this.findQuery(req, 'month')
    const paginateQuery = this.paginate(req, findQuery)
    const populatedQuery = this.populate(paginateQuery)
    const expenses = await populatedQuery.lean()

    return expenses.map(this.mapJSON)
  })

  listForYear = this.handle(async (req, _) => {

    const findQuery = this.findQuery(req, 'year')
    const paginateQuery = this.paginate(req, findQuery)
    const populatedQuery = this.populate(paginateQuery)
    const expenses = await populatedQuery.lean()

    return expenses.map(this.mapJSON)
  })

  spentOnMonth = this.handle(async (req, _) => {

    const findQuery = this.findQuery(req, 'month')
    const expenses: any[] = await findQuery.lean()
    const spent = expenses.reduce((acc, next) => acc + next.amount, 0)

    return { value: spent }
  })

  spentOnYear = this.handle(async (req, _) => {

    const findQuery = this.findQuery(req, 'year')
    const expenses: any[] = await findQuery.lean()
    const spent = expenses.reduce((acc, next) => acc + next.amount, 0)

    return { value: spent }
  })

  private findQuery = (req: Request, unit: DurationInputArg2) => {

    let dateForMoment: number[]

    if (unit === 'year') {
      dateForMoment = [req.params.year]
    } else {
      dateForMoment = [req.params.year, months.indexOf(req.params.month)]
    }

    const gteDate = moment(dateForMoment).toDate()
    const lteDate = moment(gteDate).add(1, unit).toDate()

    return Expense.find({ ...this.filters(req, { exact: ['user'] }), date: { $gte: gteDate, $lte: lteDate } })
  }

  private populate = (query: DocumentQuery<Document[], Document, {}>) => query.populate('user').populate('restaurant')
}

export default ExpensesRequestHandler