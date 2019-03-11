import Expense from '../../models/Expense';
import RequestHandler from './RequestHandler';
import moment from 'moment';
import { months } from '../../constants';

class ExpensesRequestHandler extends RequestHandler {

  create = this.handle(async (req, _) => {

    const created = await Expense.create(req.body);

    return this.mapDocument(created);
  });

  listForMonth = this.handle(async (req, _) => {

    const { year, month } = req.params

    const gteDate = moment([year, months.indexOf(month)]).toDate()
    const lteDate = moment(gteDate).add(1, 'month').toDate()

    const findQuery = Expense.find({ ...this.filters(req, { exact: ['user'] }), date: { $gte: gteDate, $lte: lteDate } })
    const paginateQuery = this.paginate(req, findQuery)
    const expenses = await paginateQuery.lean()

    return expenses.map(this.mapJSON)
  })

  listForYear = this.handle(async (req, _) => {

    const { year } = req.params

    const gteDate = moment([year]).toDate()
    const lteDate = moment(gteDate).add(1, 'year').toDate()

    const findQuery = Expense.find({ ...this.filters(req, { exact: ['user'] }), date: { $gte: gteDate, $lte: lteDate } })
    const paginateQuery = this.paginate(req, findQuery)
    const expenses = await paginateQuery.lean()

    return expenses.map(this.mapJSON)
  })

  spentOnMonth = this.handle(async (req, _) => {

    const { year, month } = req.params

    const gteDate = moment([year, months.indexOf(month)]).toDate()
    const lteDate = moment(gteDate).add(1, 'month').toDate()

    const findQuery = Expense.find({ ...this.filters(req, { exact: ['user'] }), date: { $gte: gteDate, $lte: lteDate } })
    const expenses: any[] = await findQuery.lean()
    const spent = expenses.reduce((acc, next) => acc + next.amount, 0)

    return { value: spent }
  })

  spentOnYear = this.handle(async (req, _) => {

    const { year } = req.params

    const gteDate = moment([year]).toDate()
    const lteDate = moment(gteDate).add(1, 'year').toDate()

    const findQuery = Expense.find({ ...this.filters(req, { exact: ['user'] }), date: { $gte: gteDate, $lte: lteDate } })
    const expenses: any[] = await findQuery.lean()
    const spent = expenses.reduce((acc, next) => acc + next.amount, 0)

    return { value: spent }
  })
}

export default ExpensesRequestHandler