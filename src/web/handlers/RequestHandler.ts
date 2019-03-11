import { DocumentQuery, Document } from "mongoose";
import { Request, Response } from "express";
import { isNullOrUndefined } from "util";
import Filters, { FilterOptions } from "../core/Filters";

abstract class RequestHandler {

  protected paginate = (req: Request, query: DocumentQuery<Document[], Document, {}>) => {

    const { page, perPage } = req.query

    if (isNullOrUndefined(page) || isNullOrUndefined(perPage)) {
      throw this.makePaginationError()
    }

    return query.skip((page - 1) * perPage).limit(parseInt(perPage))
  }

  protected filters = (req: Request, options: FilterOptions) => new Filters(req, options).make()

  protected mapDocument = (document: Document) => this.mapJSON(document.toJSON())

  protected mapJSON = (json: any) => {

    json.id = json._id

    delete json._id
    delete json.__v

    return json
  }

  protected handle = (makeResponse: (req: Request, res: Response) => Promise<any>) => async (req: Request, res: Response) => {
    try {
      res.send(await makeResponse(req, res));
    }
    catch (e) {
      res.status(500);
      res.send(e);
    }
  }

  private makePaginationError = () => ({
    message: 'page and perPage query params not present',
    name: 'Pagination Error'
  })
}

export default RequestHandler