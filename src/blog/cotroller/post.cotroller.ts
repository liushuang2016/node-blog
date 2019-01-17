import { ResJson } from './../../admin/dto/res.dto';
import { InfoService } from './../../common/service/info.service';
import { BlogExceptionFilter } from './../filter/blog-exception.filter';
import { Controller, Get, Res, Render, Param, Req, Query, NotFoundException, BadRequestException, UseFilters } from "@nestjs/common";
import { Response, Request } from "express";
import { PostService } from "../../common/service/post.service";
import { CommentService } from "../../common/service/comment.service";

@Controller('/')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly infoService: InfoService,
  ) { }

  // 首页
  @Get()
  index(@Res() res: Response) {
    return res.redirect('/posts')
  }

  // 文章列表
  @Get('posts')
  @Render('posts')
  async posts(@Req() req) {
    let page = req.query.p || 1
    let tag = req.query.tag || null
    page = typeof +page === 'number' ? +page : 1
    const posts = await this.postService.getPostsUsePage(page, tag)
    const postsCount = await this.postService.getPostsCount(tag)
    const pageCount = Math.ceil(
      postsCount / this.postService.postSize
    )
    const pv = await this.infoService.findPv()
    return { posts, pageCount, page, pv }
  }

  // 文章详情
  @Get('/posts/:postId')
  @Render('post')
  async post(@Param() param, @Req() req: Request) {
    const postId = param.postId
    const path = req.path
    const page = req.query.p || 1
    try {
      const post = await this.postService.findOneToHtml(postId)
      const comments = await this.commentService.getComments(postId, page)
      // 留言的页数
      let pageCount: any = Math.ceil(post['commentsCount'] / this.commentService.commentSize)

      return {
        post,
        comments,
        next: path,
        pageCount,
        page,
        title: post.title + " - LiuShuang's Blog",
        description: post.title,
        keywords: post.tags.join(', ')
      }
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  // pv增加
  @Get('/info/addpv')
  async addPv(@Res() res: Response) {
    try {
      await this.infoService.addPv()
      res.json(new ResJson({}))
    } catch (error) {
      res.json(new ResJson({ code: 500 }))
    }
  }
}
