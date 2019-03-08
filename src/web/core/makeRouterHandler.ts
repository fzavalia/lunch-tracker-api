import { Request, Response } from "express";
import ExpressRequestBodyValidator, { Schema } from "../core/ExpressRequestBodyValidator";

export interface RouterHandlerOptions {
  validation?: Schema
}

const makeRouterHandler = (handler: (req: Request, res: Response) => Promise<any>, options?: RouterHandlerOptions) => async (req: Request, res: Response) => {

  if (options && options.validation) {

    const validator = new ExpressRequestBodyValidator(req, options.validation)

    const errors = validator.validate()

    if (errors.length > 0) {

      res.status(422)
      res.json({ errors })
      return
    }
  }

  try {
    await handler(req, res)
  } catch (e) {
    res.status(500)
    res.send(e)
  }

}

export default makeRouterHandler