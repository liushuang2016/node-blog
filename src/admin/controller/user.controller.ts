import { UserService } from 'src/common/service/user.service';
import { Controller, Get, Render, UseGuards, Param, Res, Req } from "@nestjs/common";
import { AdminGuard } from 'src/common/guard/admin.guard';
import { Response } from 'express';
import { CommentService } from 'src/common/service/comment.service';

@Controller('admin/users')
@UseGuards(AdminGuard)
export class UserAdminController {
  constructor(
    private readonly userService: UserService,
    private readonly commentService: CommentService
  ) { }

  // 用户管理页
  @Get()
  @Render('admin')
  async users() {
    const users = await this.userService.getAllUsers()
    return {
      data: users,
      render: 'users'
    }
  }

  // 删除用户
  @Get('/:userId/delete')
  async delUser(@Param() param, @Res() res: Response, @Req() req: any) {
    const userId = param.userId
    try {
      await this.userService.delUserById(userId)
      req.flash('success', '删除成功')
    } catch (e) {
      req.flash('error', e.message)
    }
    res.redirect('/admin/users')
  }

  // 用户评论管理
  @Get('/:userId/comments')
  @Render('admin/users-comments')
  async userComments(@Param() param, @Req() req, @Res() res) {
    const userId = param.userId
    const page = req.query.q || 1
    const path = req.path
    try {
      const comments = await this.commentService.getCommentsByUserId(userId)
      const commentsCount = await this.commentService.getCommentsCount({ author: userId })
      const pageCount = Math.ceil(commentsCount / this.commentService.commentSize)
      return { comments, commentsCount, pageCount, page, next: path }
    } catch (e) {
      req.flash('error', e.message)
    }
    res.redirect('/admin/users')
  }
}
