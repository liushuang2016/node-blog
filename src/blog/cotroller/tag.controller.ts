import { Controller, Get, Render } from "@nestjs/common";
import { CommentService } from "src/common/service/comment.service";
import { TagService } from "src/common/service/tag.service";

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagService) { }

  // tags 页面
  @Get()
  @Render('tags')
  async tags() {
    const tags = await this.tagService.getTags()
    return { tags }
  }
}
