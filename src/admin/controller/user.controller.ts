import { UserService } from 'src/common/service/user.service';
import { Controller, Get, Render, UseGuards } from "@nestjs/common";
import { AdminGuard } from 'src/common/guard/admin.guard';

@Controller('admin/users')
@UseGuards(AdminGuard)
export class UserAdminController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @Render('admin')
  async users() {
    const users = await this.userService.getAllUsers()
    return {
      data: users,
      render: 'users'
    }
  }
}
