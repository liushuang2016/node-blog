import { AdminExceptionFilter } from './../filter/admin-exception.filter';
import { Controller, Get, Param, UseGuards, Req, Res, UseFilters, Query } from "@nestjs/common";
import { AdminGuard } from "../../common/guard/admin.guard";
import { CommentService } from "../../common/service/comment.service";
import { PostService } from "../../common/service/post.service";
import { ResJson } from '../dto/res.dto';

@Controller('admin/comments')
@UseGuards(AdminGuard)
@UseFilters(AdminExceptionFilter)
export class CommentAdminController {
  constructor(
    private readonly commentService: CommentService,
    private readonly postService: PostService
  ) { }

  // 评论列表
  @Get('/all')
  async comments(@Query() query) {
    const page = query.p || 1
    const q = {}
    if (query.pid) {
      q['postId'] = query.pid
    }
    if (query.uid) {
      q['author'] = query.uid
    }
    try {
      const comments = await this.commentService.getAllComments(q, page)
      const commentsCount = await this.commentService.getCommentsCount(q)
      return new ResJson({ data: { comments, totalCount: commentsCount } })
    } catch (e) {
      let msg = e.message
      if (e.kind === 'ObjectId') {
        msg = '用户名或文章id不存在'
      }
      return new ResJson({ msg, code: 400 })
    }
  }

  // 删除评论
  @Get('/:commentId/delete')
  async delete(
    @Param() param, @Req() req
  ) {
    const cid = param.commentId
    const page = req.query.p || 1

    let code = 200
    let msg = ''

    try {
      let comment = await this.commentService.delById(cid)

      if (!comment) {
        throw new Error('删除失败')
      }
      // 更新文章 commentsCount 
      await this.postService.updateCommentsCount(comment['postId'])
      msg = '删除成功'
    } catch (e) {
      code = 400
      msg = e.message
    }
    return new ResJson({ code, msg })
  }
}
