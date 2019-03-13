import { NextFunction, Response, Request } from 'express'
import Token from '../core/Token';

class AuthMiddleware {

  constructor(private token: Token) { }

  handler = (req: Request, res: Response, next: NextFunction) => {

    const authorization = req.headers.authorization

    if (!authorization) {

      res.status(400)
      res.send({
        message: 'Authorization header not present',
        name: 'AuthorizationHeaderNotPresent'
      })
      return
    }

    const [, _token] = authorization.split(' ')

    if (this.token.isInvalid(_token)) {

      res.status(403)
      res.send({
        message: 'Invalid Token',
        name: 'InvalidToken'
      })
      return
    }

    next()
  }
}
export default AuthMiddleware