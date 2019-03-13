import RequestHandler from "./RequestHandler";
import { ExpressRequestBodyValidatorTypes } from "../core/ExpressRequestBodyValidator";
import Token from "../core/Token";

class TokensRequestHandler extends RequestHandler {

  constructor(private token: Token, private password: string) {
    super()
  }

  create = this.handle(async (req, _) => {

    this.validate(req, {
      password: {
        type: ExpressRequestBodyValidatorTypes.String,
        required: true
      }
    })

    if (req.body.password !== this.password) {
      throw {
        message: 'Invalid Password',
        name: 'InvalidPassword'
      }
    }

    return {
      token: this.token.makeFromData({ message: 'no need to decode bro' })
    }
  })
}

export default TokensRequestHandler