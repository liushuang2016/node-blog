import { UserService } from 'src/common/service/user.service';
import { Controller, Get, Render, UseGuards, Param, Res, Req } from "@nestjs/common";
import { AdminGuard } from 'src/common/guard/admin.guard';
import { Response } from 'express';

@Controller('admin/users')
@UseGuards(AdminGuard)
export class UserAdminController {
  constructor(private readonly userService: UserService) { }

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
}
