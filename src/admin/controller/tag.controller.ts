import { AdminExceptionFilter } from './../filter/admin-exception.filter';
import { TagService } from '../../common/service/tag.service';
import { AdminGuard } from '../../common/guard/admin.guard';
import { PostService } from '../../common/service/post.service';
import { Controller, Get, Render, Res, UseGuards, Post, Body, Req, Param, UseFilters, Query } from "@nestjs/common";
import { Response } from "express";
import { PostDto } from '../../admin/dto/post.dto';
import { CommentService } from '../../common/service/comment.service';
import { ResJson } from '../dto/res.dto';

@Controller('admin/tags')
@UseGuards(AdminGuard)
export class TagAdminController {
  constructor(
    private readonly tagService: TagService
  ) { }

  // tag列表
  @Get('/all')
  async tags(@Query() query) {
    const page = query.p || 1
    try {
      const tags = await this.tagService.getTagsAndPostCount(page)
      const tagsCount = await this.tagService.getTagsCount()
      return new ResJson({ data: { tags, totalCount: tagsCount } })
    } catch (e) {
      console.log(e);

    }

  }

  // 删除
  @Get('/:tagId/delete')
  async delete(@Param() param) {
    const tagId = param.tagId
    let code = 200
    let msg = ''
    try {
      await this.tagService.delTagById(tagId)
      msg = '删除成功'
    } catch (e) {
      code = 400
      msg = e.message
    }
    return new ResJson({ code, msg })
  }
}
