import { Controller, Get, Param, UseGuards, Req, Res } from "@nestjs/common";
import { AdminGuard } from "src/common/guard/admin.guard";
import { CommentService } from "src/common/service/comment.service";

@Controller('admin/comments')
@UseGuards(AdminGuard)
export class CommentAdminController {
  constructor(private readonly commentService: CommentService) { }

  @Get('/:commentId/delete')
  async delete(
    @Param() param, @Req() req, @Res() res
  ) {
    const cid = param.commentId
    const path = req.query.next
    const page = req.query.p || 1

    try {
      await this.commentService.delById(cid)
      req.flash('success', '删除成功')
    } catch (e) {
      req.flash('error', '删除失败')
    }
    res.redirect(`${path}?p=${page}`)
  }
}
