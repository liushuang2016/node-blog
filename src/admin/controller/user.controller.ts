import { AdminExceptionFilter } from './../filter/admin-exception.filter';
import { UserService } from '../../common/service/user.service';
import { Controller, Get, Render, UseGuards, Param, Res, Req, Post, Body, UseFilters, Query } from "@nestjs/common";
import { AdminGuard } from '../../common/guard/admin.guard';
import { Response } from 'express';
import { CommentService } from '../../common/service/comment.service';
import { ResJson } from '../dto/res.dto';


@Controller('admin/users')
@UseGuards(AdminGuard)
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
  @Get('/all')
  async getAllUsers(@Query() query) {
    const page = query.p || 1

    let users = await this.userService.getAllUsers(page)
    let usersCount = await this.userService.getUsersCount()
    return new ResJson({ data: { users, totalCount: usersCount } })
  }

  // 删除用户
  @Get('/:userId/delete')
  async delUser(@Param() param) {
    const userId = param.userId
    let code = 200
    let msg = ''
    try {
      await this.userService.delUserById(userId)
      msg = '删除成功'
    } catch (e) {
      code = 400
      msg = '删除失败'
    }
    return new ResJson({ code, msg })
  }
}
