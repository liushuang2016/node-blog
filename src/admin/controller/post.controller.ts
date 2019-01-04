import { AdminExceptionFilter } from './../filter/admin-exception.filter';
import { TagService } from '../../common/service/tag.service';
import { AdminGuard } from '../../common/guard/admin.guard';
import { PostService } from '../../common/service/post.service';
import { Controller, Get, Render, Res, UseGuards, Post, Body, Req, Param, UseFilters } from "@nestjs/common";
import { Response } from "express";
import { PostDto } from '../../admin/dto/post.dto';
import { CommentService } from '../../common/service/comment.service';
import { ResJson } from '../dto/res.dto';

@Controller('admin')
@UseGuards(AdminGuard)
@UseFilters(AdminExceptionFilter)
export class PostAdminController {
  constructor(
    private readonly postService: PostService,
    private readonly tagService: TagService,
    private readonly commentService: CommentService
  ) { }

  // 获取所有文章
  @Get('/posts/all')
  async posts(@Req() req) {
    const page = req.query.p || 1
    const posts = await this.postService.getPostsUsePage(page)
    const totalCount = await this.postService.getPostsCount()
    return new ResJson({ data: { posts, totalCount } })
  }

  // 创建文章
  @Post('/posts/create')
  async create(@Body() postDto: PostDto, @Req() req: any) {
    const tags = postDto.tags.split(/\s+/)
    const post = {
      title: postDto.title,
      content: postDto.content,
      tags: tags,
      author: req.session.user._id
    }

    let code = 200
    let msg = ''

    try {
      // 新增文章
      await this.postService.addPost(post)
      // 保存tag
      await this.tagService.saveTags(tags)
      msg = '发布成功'
    } catch (e) {
      if (e.code == 11000) {
        msg = '文章标题重复'
        code = 11000
      } else {
        msg = e.message || e.errmsg
        code = 400
      }
    }
    return new ResJson({ msg, code })
  }

  // 获取文章内容
  @Get('/posts/:postId/edit')
  async editPage(@Param() param: any, @Req() req: any) {
    const postId = param.postId

    let code = 200
    let msg = ''
    let data = null

    try {
      const post = await this.postService.getRawPostById(postId)
      post['stringTags'] = post['tags'].join(' ')
      data = post
    } catch (e) {
      code = 400
      msg = e.message
    }
    return new ResJson({ code, msg, data })
  }

  // 编辑文章
  @Post('/posts/:postId/edit')
  async edit(
    @Param() param: any,
    @Body() postDto: PostDto,
    @Req() req: any
  ) {
    const postId = param.postId
    const tags = postDto.tags.split(/\s+/)
    const post = {
      title: postDto.title,
      content: postDto.content,
      tags: tags
    }

    let msg = ''
    let code = 200

    try {
      // 保存tag
      await this.tagService.saveTags(tags)
      // 更新文章
      await this.postService.updateById(postId, post)
      msg = '更新成功'
    } catch (e) {
      msg = e.message
      code = 400
      if (e.code === 11000) {
        msg = '标题重复'
      }
    }
    return new ResJson({ msg, code })
  }

  // 删除文章
  @Get('/posts/:postId/delete')
  async deletePost(@Param() param, @Res() res: Response, @Req() req: any) {
    const postId = param.postId
    try {
      await this.postService.delPostById(postId)
      req.flash('success', '删除成功')
    } catch (e) {
      req.flash('error', e.message)
    }
    res.redirect('/admin/posts')
  }
}
