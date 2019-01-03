import { AdminExceptionFilter } from './../filter/admin-exception.filter';
import { ResJson } from './../dto/res.dto';
import { UserService } from './../../common/service/user.service';
import { LoginDto } from './../dto/login.dto';
import { Controller, Post, Body, Req, UseFilters, Get } from "@nestjs/common";
import * as sha1 from "sha1";


@Controller('/admin/users')
@UseFilters(AdminExceptionFilter)
export class LoginAdminCtroller {
  constructor(
    private readonly userService: UserService
  ) { }

  // 登录
  @Post('/login')
  async adminLogin(@Body() loginDto: LoginDto, @Req() req) {
    let user = await this.userService.getUser({ name: loginDto.name })
    let msg = ''
    let code = 200
    if (user && user.role === 1) {
      if (user.password === sha1(loginDto.password)) {
        req.session.user = user
        // 过期时间
        const n = 1000 * 60 * 10
        req.session.cookie.expires = new Date(Date.now() + n)
      } else {
        msg = '密码错误'
        code = 401
      }
    } else {
      msg = '没有管理员权限'
      code = 403
    }
    return new ResJson({ code, msg })
  }

  // 登出
  @Get('/logout')
  async adminLogout(@Req() req) {
    req.session.user = null
    return new ResJson({})
  }
}
