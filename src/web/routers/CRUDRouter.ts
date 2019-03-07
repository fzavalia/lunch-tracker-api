import { Router, Request, Response } from 'express'
import mongoose from 'mongoose'
import CRUDRepository from '../../repository/CRUDRepository';

type Model = mongoose.Model<mongoose.Document, {}>

interface Config {
  mapInputData?: (data: any) => any
}

class CRUDRouter {

  static fromScratch = (model: Model, config: Config = {}) => new CRUDRouter(model, Router(), config).getRouter()

  static addToRouter = (model: Model, router: Router, config: Config = {}) => new CRUDRouter(model, router, config).getRouter()

  private crudRouter: CRUDRepository

  private constructor(private model: Model, private router: Router, private config: Config) {

    this.crudRouter = new CRUDRepository(model)

    this.getRouter().get('/', this.requestHandler(req => this.crudRouter.list(req.query.page, parseInt(req.query.perPage))))

    this.getRouter().get('/:id', this.requestHandler(req => this.crudRouter.find(req.params.id)))

    this.getRouter().post('/', this.requestHandler(req => this.crudRouter.create(this.mapInputData(req.body))))

    this.getRouter().put('/:id', this.requestHandler(req => this.crudRouter.update(req.params.id, this.mapInputData(req.body))))

    this.getRouter().delete('/:id', this.requestHandler(req => this.crudRouter.delete(req.params.id)))
  }

  private getRouter = () => this.router

  private requestHandler = (func: (req: Request) => Promise<any>) => async (req: Request, res: Response) => {
    try {
      res.send(await func(req))
    } catch (e) {
      res.status(500)
      res.send(e)
    }
  }

  private mapInputData = (data: any) => this.config.mapInputData ? this.config.mapInputData(data) : data
}

export default CRUDRouter