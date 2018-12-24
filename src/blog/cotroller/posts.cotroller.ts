import { Controller, Get, Res, Render } from "@nestjs/common";
import { Response } from "express";


@Controller()
export class PostsController {
  @Get()
  index(@Res() res: Response) {
    return res.redirect('/posts')
  }

  @Get('posts')
  @Render('posts')
  posts() {
    return { posts: [] }
  }
}
