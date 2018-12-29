import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TagInterface } from "src/model/Tag";

@Injectable()
export class TagService {
  constructor(
    @InjectModel('tag') private readonly tagModel: Model<TagInterface>
  ) { }

  async saveTag(tag: string) {
    try {
      if (tag.length) {
        await new this.tagModel({ tag }).save()
        return true
      }
    } catch (e) {
      // 如果tag重复会抛出异常
    }
    return false
  }

  async saveTags(tags: string[]) {
    tags.forEach(async tag => {
      await this.saveTag(tag)
    })
  }

  async getTags() {
    return await this.tagModel.find()
  }
}
