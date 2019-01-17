import { InjectModel } from '@nestjs/mongoose';
import { InfoInterface } from './../../model/Info';
import { Model } from 'mongoose';
import { Injectable } from "@nestjs/common";

@Injectable()
export class InfoService {
  constructor(
    @InjectModel('info') private readonly infoModel: Model<InfoInterface>,
  ) { }

  async addPv() {
    const pv = await this.infoModel.findOneAndUpdate({ key: 'pv' }, { $inc: { number: 1 } })
    if (!pv) {
      await this.infoModel.create({ key: 'pv', number: 1 })
    }
  }

  async findPv() {
    const pv = await this.infoModel.findOne({ key: 'pv' })
    if (!pv) {
      await this.infoModel.create({ key: 'pv', number: 1 })
      return 1
    }
    return pv.number
  }
}
