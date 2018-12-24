import { Controller, Get, Res, Render } from "@nestjs/common";
import { Response } from "express";
import { PostService } from "src/common/service/post.service";

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Get()
  index(@Res() res: Response) {
    return res.redirect('/posts')
  }

  @Get('posts')
  @Render('posts')
  async posts() {
    const posts = await this.postService.getPosts()
    return { posts }
  }
}
