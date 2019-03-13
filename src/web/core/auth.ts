import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';

class Auth {

  private salt: string

  constructor(private secret: string) {
    this.salt = bcrypt.genSaltSync(10)
  }

  saltPassword = async (password: string) => {
    if (!this.salt) {
      this.salt = await bcrypt.genSalt(10)
    }
    return await bcrypt.hash(password, this.salt)
  }

  comparePasswordToHash = async (password: string, hash: string) => {

    const match = await bcrypt.compare(password, hash)

    if (!match) {
      throw {
        message: 'Invalid Password',
        name: 'InvalidPassword'
      }
    }
  }

  makeToken = (data: any) => jwt.sign(data, this.secret)

  tokenIsValid = (token: string) => {
    try {
      jwt.verify(token, this.secret)
      return true
    } catch (e) {
      return false
    }
  }

  middleware = (req: Request, res: Response, next: NextFunction) => {

    const authorization = req.headers.authorization

    if (!authorization) {

      res.status(400)
      res.send({
        message: 'Authorization header not present',
        name: 'AuthorizationHeaderNotPresent'
      })
      return
    }

    const token = authorization.split(' ')[1]

    if (!this.tokenIsValid(token)) {

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

export default Auth