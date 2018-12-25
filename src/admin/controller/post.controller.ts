import { TagService } from 'src/common/service/tag.service';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { PostService } from 'src/common/service/post.service';
import { Controller, Get, Render, Res, UseGuards, Post, Body, Req, Param } from "@nestjs/common";
import { Response } from "express";
import { PostDto } from 'src/admin/dto/post.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class PostAdminController {
  constructor(
    private readonly postService: PostService,
    private readonly tagService: TagService
  ) { }

  // 管理首页
  @Get()
  async index(@Res() res: Response) {
    return res.redirect('/admin/posts')
  }

  // 管理文章页
  @Get('/posts')
  @Render('admin')
  async posts() {
    const posts = await this.postService.getPosts()
    return {
      data: posts,
      render: 'posts'
    }
  }

  // 创建文章页
  @Get('/posts/create')
  @Render('admin/create')
  async createPage() {
    return {}
  }

  // 创建文章
  @Post('/posts/create')
  async create(@Body() postDto: PostDto, @Req() req: any, @Res() res: Response) {
    const tags = postDto.tags.split(/\s+/)
    const post = {
      title: postDto.title,
      content: postDto.content,
      tags: postDto.tags,
      author: req.session.user._id
    }

    try {
      // 新增文章
      await this.postService.addPost(post)
      // 保存tag
      await this.tagService.saveTags(tags)
      // 创建成功后更新 getPosts
      await this.postService.getPosts(true)
      req.flash('success', '发布成功')
      res.redirect('/admin/posts')
    } catch (e) {
      req.flash('error', e.message)
      res.redirect('back')
    }
  }

  // 编辑文章页
  @Get('/posts/:postId/edit')
  @Render('admin/edit')
  async editPage(@Param() param: any, @Req() req: any, @Res() res: Response) {
    const postId = param.postId

    try {
      const post = await this.postService.getRawPostById(postId)
      post['tags'] = post['tags'].join(' ')
      return { post }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('/admin/posts')
    }
  }

  // 编辑文章
  @Post('/posts/:postId/edit')
  async edit(
    @Param() param: any,
    @Body() postDto: PostDto,
    @Req() req: any,
    @Res() res: Response
  ) {
    const postId = param.postId
    const tags = postDto.tags.split(/\s+/)
    const post = {
      title: postDto.title,
      content: postDto.content,
      tags: postDto.tags
    }

    try {
      // 保存tag
      await this.tagService.saveTags(tags)
      // 更新文章
      await this.postService.updateById(postId, post)
      // 创建成功后更新 getPosts
      await this.postService.getPosts(true)
      req.flash('success', '更新成功')
      return res.redirect('/admin/posts')
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }
  }

  // 删除文章
  @Get('/posts/:postId/delete')
  async deletePost(@Param() param, @Res() res: Response, @Req() req: any) {
    const postId = param.postId
    try {
      await this.postService.delPostById(postId)
      // 更新 getposts
      await this.postService.getPosts(true)
      req.flash('success', '删除成功')
    } catch (e) {
      req.flash('error', e.message)
    }
    res.redirect('/admin/posts')
  }
}
