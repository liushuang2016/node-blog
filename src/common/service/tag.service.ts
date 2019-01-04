import { PostInterface } from './../../model/Post';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TagInterface } from "../../model/Tag";
import { format } from '../utils';

@Injectable()
export class TagService {
  public readonly tagSize = 20

  constructor(
    @InjectModel('tag') private readonly tagModel: Model<TagInterface>,
    @InjectModel('post') private readonly postModel: Model<PostInterface>
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

  async getTagsAndPostCount(page = 1) {
    let tags = await this.tagModel
      .find().skip((page - 1) * this.tagSize).limit(this.tagSize)

    let _tags = tags.map(async (tag) => {
      tag = tag.toObject()
      tag.ct = format(tag.ct)
      tag['postCount'] = await this.postModel.countDocuments({ tags: tag.tag })
      return tag
    })

    return Promise.all(_tags)
  }

  async getTagsCount(query = {}) {
    return await this.tagModel.countDocuments(query)
  }

  async delTagById(id) {
    return await this.tagModel.deleteOne({ _id: id })
  }
}
