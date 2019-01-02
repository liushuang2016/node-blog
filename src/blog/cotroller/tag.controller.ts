import { BlogExceptionFilter } from './../filter/blog-exception.filter';
import { Controller, Get, Render, UseFilters } from "@nestjs/common";
import { TagService } from "../../common/service/tag.service";

@Controller('tags')
@UseFilters(BlogExceptionFilter)
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
