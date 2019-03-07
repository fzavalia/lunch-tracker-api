import mongoose from 'mongoose'

class CRUDRepository {

  constructor(private model: mongoose.Model<mongoose.Document, {}>) { }

  find = async (id: string) =>
    await this.model
      .findById(id)
      .orFail()
      .lean()

  list = async (page: number, perPage: number) =>
    await this.model
      .find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .orFail()
      .lean()

  create = async (data: any) =>
    await this.model
      .create(data)
      .then(res => res.toObject())

  update = async (id: string, data: any) =>
    await this.model
      .findByIdAndUpdate(id, data, { new: true })
      .orFail()
      .lean()

  delete = async (id: string) =>
    await this.model
      .findByIdAndDelete(id)
      .orFail()
      .lean()
}

export default CRUDRepository