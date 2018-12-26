import { Controller, Get, Res, Render, Param } from "@nestjs/common";
import { Response } from "express";
import { PostService } from "src/common/service/post.service";

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) { }

  // 首页
  @Get()
  index(@Res() res: Response) {
    return res.redirect('/posts')
  }

  // 文章列表
  @Get('posts')
  @Render('posts')
  async posts() {
    const posts = await this.postService.getPosts()
    return { posts }
  }

  // 文章详情
  @Get('/posts/:postId')
  @Render('post')
  async post(@Param() param) {
    const postId = param.postId

    try {
      const post = await this.postService.findByIdToHtml(postId)
      // 更新getPosts
      this.postService.getPosts(true)
      return { post }
    } catch (e) {
      throw e
    }
  }
}
