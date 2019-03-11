import { Request } from "express";

export interface FilterOptions {
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

export default Filters