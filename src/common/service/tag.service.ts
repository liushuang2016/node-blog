import { Injectable } from "@nestjs/common";
import { Tag } from "src/model/Tag";

@Injectable()
export class TagService {
  async saveTag(tag: string) {
    try {
      if (tag.length) {
        await new Tag({ tag }).save()
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
}
