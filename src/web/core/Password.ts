import bcrypt from 'bcrypt'

class Password {

  private salt: string

  constructor() {
    this.salt = bcrypt.genSaltSync(10)
  }

  hash = async (password: string) => {
    if (!this.salt) {
      this.salt = await bcrypt.genSalt(10)
    }
    return await bcrypt.hash(password, this.salt)
  }

  validate = async (password: string, hash: string) => {

    const match = await bcrypt.compare(password, hash)

    if (!match) {
      throw {
        message: 'Invalid Password',
        name: 'InvalidPassword'
      }
    }
  }
}

export default Password