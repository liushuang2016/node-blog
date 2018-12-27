import { Controller, Get, Res, Render, Param, Req } from "@nestjs/common";
import { Response, Request } from "express";
import { PostService } from "src/common/service/post.service";
import { CommentService } from "src/common/service/comment.service";

@Controller()
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService
  ) { }

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
  async post(@Param() param, @Req() req: Request) {
    const postId = param.postId
    const path = req.path

    try {
      const post = await this.postService.findByIdToHtml(postId)
      const comments = await this.commentService.getComments(postId)

      // 更新getPosts
      this.postService.getPosts(true)
      return { post, comments, next: path }
    } catch (e) {
      throw e
    }
  }
}
