import { AdminGuard } from 'src/common/guard/admin.guard';
import { PostService } from 'src/common/service/post.service';
import { Controller, Get, Render, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";

@Controller('admin')
@UseGuards(AdminGuard)
export class PostAdminController {
  constructor(private readonly postService: PostService) { }

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
}
