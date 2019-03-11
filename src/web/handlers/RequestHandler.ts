import { DocumentQuery, Document } from "mongoose";
import { Request } from "express";
import { isNullOrUndefined } from "util";

interface FilterOptions {
  like?: string[]
  exact?: string[]
}

class Filters {

  constructor(private req: Request, private options: FilterOptions) { }

  make = () => {
    let filters = {}

    if (this.options.exact) {
      filters = { ...filters, ...this.exact(this.options.exact) }
    }

    if (this.options.like) {
      filters = { ...filters, ...this.like(this.options.like) }
    }

    return filters
  }

  private like = (properties: string[]) => this.makeFilters(properties, (value: any) => new RegExp(value, 'i'))

  private exact = (properties: string[]) => this.makeFilters(properties, (value: any) => value)

  private makeFilters = (properties: string[], map: (val: any) => any) =>
    properties.reduce((acc, property) => {
      const value = this.req.query[property]
      if (value) {
        return { ...acc, [property]: map(value) }
      }
      return acc
    }, {})

}

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

  private makePaginationError = () => ({
    message: 'page and perPage query params not present',
    name: 'Pagination Error'
  })
}

export default RequestHandler