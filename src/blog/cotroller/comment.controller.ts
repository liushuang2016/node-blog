import { CommentDto } from '../dto/comment.dto';
import { CommentService } from '../../common/service/comment.service';
import { Controller, Post, Param, Req, UseGuards, Body, Res, Query } from "@nestjs/common";
import { LoginGuard } from '../../common/guard/checkLogin.guard';
import { Response } from 'express';
import { PostService } from '../../common/service/post.service';

@Controller()
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly postService: PostService
  ) { }

  // 评论
  @Post('/comments/:postId')
  @UseGuards(LoginGuard)
  async comments(
    @Body() commentDto: CommentDto,
    @Param() param: any,
    @Req() req: any,
    @Res() res: Response
  ) {
    const postId = param.postId
    const user = req.session.user
    const userId = user._id
    const page = req.query.p || 1
    const content = commentDto.content

    if (!content.trim()) {
      req.flash('error', '评论不能为空')
      return res.redirect(`/posts/${postId}?p=${page}#comments-container`)
    }

    const comment = {
      postId,
      author: userId,
      content: commentDto.content
    }

    try {
      await this.commentService.addComment(comment, user)
      const commentsCount = await this.commentService.getCommentsCount({ postId })
      // 更新文章 commentsCount
      await this.postService.updateCommentsCount(postId, commentsCount)
      // 翻页更新page
      let nPage = Math.ceil(commentsCount / this.commentService.commentSize)
      return res.redirect(`/posts/${postId}?p=${nPage}#comments`)
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect(`/posts/${postId}?p=${page}#comments-container`)
    }
  }
}
