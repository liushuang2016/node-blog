import { CommentDto } from 'src/blog/dto/comment.dto';
import { CommentService } from 'src/common/service/comment.service';
import { Controller, Post, Param, Req, UseGuards, Body, Res, Query } from "@nestjs/common";
import { LoginGuard } from 'src/common/guard/checkLogin.guard';
import { Response } from 'express';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post('/comments/:postId')
  @UseGuards(LoginGuard)
  async comments(
    @Body() commentDto: CommentDto,
    @Param() param: any,
    @Req() req: any,
    @Res() res: Response,
    @Query() query: any
  ) {
    const postId = param.postId
    const userId = req.session.user._id
    const page = query.p || 1

    const comment = {
      postId,
      author: userId,
      content: commentDto.content
    }

    try {
      await this.commentService.addComment(comment)
      // req.flash('success', '留言成功')
      const commentsCount = await this.commentService.getCommentsCount({ postId })
      // 翻页更新page
      let page = Math.ceil(commentsCount / this.commentService.commentSize)
      return res.redirect(`/posts/${postId}?p=${page}#comments`)
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect(`/posts/${postId}?p=${page}#comments-container`)
    }
  }
}
