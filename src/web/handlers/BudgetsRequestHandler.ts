import Budget from '../../models/Budget';
import RequestHandler from './RequestHandler';

class BudgetsRequestHandler extends RequestHandler {

  create = this.handle(async (req, _) => {

    const created = await Budget.create(req.body)

    return this.mapDocument(created)
  })

  list = this.handle(async (req, _) => {

    const findQuery = Budget.find(this.filters(req, { exact: ['year', 'month'] }))
    const paginateQuery = this.paginate(req, findQuery)
    const budgets = await paginateQuery.lean()

    return budgets.map(this.mapJSON);
  })

  update = this.handle(async (req, _) => {

    const updated = await Budget.findByIdAndUpdate(req.params.id, { amount: req.body.amount }, { new: true }).lean()

    return this.mapJSON(updated);
  })
}

export default BudgetsRequestHandler