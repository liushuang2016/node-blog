import { AdminExceptionFilter } from './../filter/admin-exception.filter';
import { UserService } from '../../common/service/user.service';
import { Controller, Get, Render, UseGuards, Param, Res, Req, Post, Body, UseFilters } from "@nestjs/common";
import { AdminGuard } from '../../common/guard/admin.guard';
import { Response } from 'express';
import { CommentService } from '../../common/service/comment.service';
import { ResJson } from '../dto/res.dto';


@Controller('admin/users')
@UseGuards(AdminGuard)
@UseFilters(AdminExceptionFilter)
export class UserAdminController {
  constructor(
    private readonly userService: UserService,
    private readonly commentService: CommentService
  ) { }

  // 获取当前用户
  @Get('/currentUser')
  async getCurrentUser(@Req() req) {
    let user = req.session.user
    let u = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar
    }

    return new ResJson({ data: u })
  }

  // 获取所有用户
  async getAllUsers() {
    let users = await this.userService.getAllUsers()
    return new ResJson({ data: users })
  }

  // 删除用户
  @Get('/:userId/delete')
  async delUser(@Param() param, @Res() res: Response, @Req() req: any) {
    const userId = param.userId
    try {
      await this.userService.delUserById(userId)
      req.flash('success', '删除成功')
    } catch (e) {
      req.flash('error', '删除失败')
    }
    res.redirect('/admin/users')
  }

  // 用户评论管理
  @Get('/:userId/comments')
  async userComments(@Param() param, @Req() req, @Res() res) {
    const userId = param.userId
    const page = req.query.p || 1
    const path = req.path
    try {
      const comments = await this.commentService.getCommentsByUserId(userId, page)
      const commentsCount = await this.commentService.getCommentsCount({ author: userId })
      const pageCount = Math.ceil(commentsCount / this.commentService.commentSize)
      return res.render('admin/users-comments', { comments, commentsCount, pageCount, page, next: path })
    } catch (e) {
      req.flash('error', '用户不存在')
      return res.redirect('/admin/users')
    }
  }
}
