import jwt from 'jsonwebtoken'

class Token {

  static withSecret = (secret: string) => {
    return new Token(secret)
  }

  private constructor(private secret: string) { }

  makeFromData = (data: any) => jwt.sign(data, this.secret, { expiresIn: '1 week' })

  isValid = (token: string) => {
    try {
      jwt.verify(token, this.secret)
      return true
    } catch (e) {
      return false
    }
  }

  isInvalid = (token: string) => !this.isValid(token)
}

export default Token