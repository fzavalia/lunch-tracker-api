import { DocumentQuery, Document } from "mongoose";
import { Request, Response } from "express";
import { isNullOrUndefined } from "util";
import Filters, { FilterOptions } from "../core/Filters";
import ExpressRequestBodyValidator, { Schema } from "../core/ExpressRequestBodyValidator";

abstract class RequestHandler {

  protected handle = (makeResponse: (req: Request, res: Response) => Promise<any>) => async (req: Request, res: Response) => {
    try {
      res.send(await makeResponse(req, res));
    }
    catch (e) {
      res.status(500);
      res.send(e);
    }
  }

  protected validate = (req: Request, schema: Schema) => {

    const validationErrors = new ExpressRequestBodyValidator(req, schema).validate()

    if (validationErrors.length > 0) {
      throw {
        message: validationErrors,
        name: 'ValidationError'
      }
    }
  }

  protected filters = (req: Request, options: FilterOptions) => new Filters(req, options).make()

  protected paginate = (req: Request, query: DocumentQuery<Document[], Document, {}>) => {

    const { page, perPage } = req.query

    if (isNullOrUndefined(page) || isNullOrUndefined(perPage)) {
      throw {
        message: 'page and perPage query params not present',
        name: 'PaginationError'
      }
    }

    return query.skip((page - 1) * perPage).limit(parseInt(perPage))
  }

  protected mapDocument = (document: Document) => this.mapJSON(document.toJSON())

  protected mapJSON = (json: any) => {

    json.id = json._id

    delete json._id
    delete json.__v

    return json
  }
}

export default RequestHandler