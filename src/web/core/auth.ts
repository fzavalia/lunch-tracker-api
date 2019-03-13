import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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

  validateToken = (token: string) => {
    jwt.verify(token, this.secret)
  }
}

export default Auth