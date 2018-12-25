import { Post as PostModel } from 'src/model/Post';
import { TagService } from 'src/common/service/tag.service';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { PostService } from 'src/common/service/post.service';
import { Controller, Get, Render, Res, UseGuards, Post, Body, Req } from "@nestjs/common";
import { Response } from "express";
import { PostDto } from 'src/admin/dto/post.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class PostAdminController {
  constructor(
    private readonly postService: PostService,
    private readonly tagService: TagService
  ) { }

  @Get()
  async index(@Res() res: Response) {
    return res.redirect('/admin/posts')
  }

  @Get('/posts')
  @Render('admin')
  async posts() {
    const posts = await this.postService.getPosts()
    return {
      data: posts,
      render: 'posts'
    }
  }

  @Get('/posts/create')
  @Render('admin/create')
  async createPage() {
    return {}
  }

  @Post('/posts/create')
  async create(@Body() postDto: PostDto, @Req() req: any, @Res() res: Response) {
    const tags = postDto.tags.split(/\s+/)
    const userId = req.session.user._id
    let post = new PostModel({
      title: postDto.title,
      content: postDto.content,
      tags: postDto.tags,
      author: userId
    })

    try {
      post = await post.save()
      // 保存tag
      tags.forEach(tag => {
        this.tagService.saveTag(tag)
      })
      // 创建成功后更新 getPosts
      await this.postService.getPosts(true)
      req.flash('success', '发布成功')
      res.redirect('/admin/posts')
    } catch (e) {
      throw e
    }
  }
}
