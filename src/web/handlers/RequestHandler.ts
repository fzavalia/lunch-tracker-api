import { DocumentQuery, Document } from "mongoose";
import { Request } from "express";
import { isNullOrUndefined } from "util";

abstract class RequestHandler {

  paginate = (req: Request, query: DocumentQuery<Document[], Document, {}>) => {

    const { page, perPage } = req.query

    if (isNullOrUndefined(page) || isNullOrUndefined(perPage)) {
      throw this.makePaginationError()
    }

    return query.skip((page - 1) * perPage).limit(parseInt(perPage))
  }

  filters = (req: Request, ...properties: [string]) =>
    properties.reduce((acc, property) => {

      const value = req.query[property]

      if (value) {
        return { ...acc, [property]: new RegExp(value, 'i') }
      }

      return acc

    }, {})

  private makePaginationError = () => ({
    message: 'page and perPage query params not present',
    name: 'Pagination Error'
  })
}

export default RequestHandler