import { UserService } from 'src/common/service/user.service';
import { Controller, Get, Render } from "@nestjs/common";

@Controller('admin/users')
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
