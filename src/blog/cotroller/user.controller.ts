
import { Controller, Get, Render, UseGuards, Req, Res, Body, Post, Query } from "@nestjs/common";
import { NotLoginGuard } from "../../common/guard/checkNotLogin.guard";
import { Request, Response } from "express";
import { LoginDto } from "../dto/login.dto";
import * as sha1 from "sha1";
import { UserService } from "../../common/service/user.service";

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Get('/login')
  @Render('login')
  @UseGuards(NotLoginGuard)
  loginPage() {
    return {}
  }

  // 登出
  @Get('/logout')
  logout(@Req() req: any, @Res() res: Response) {
    if (req.session.user) {
      req.session.user = null
      req.flash('success', '登出成功')
    }
    return res.redirect('/posts')
  }

  // 登录、注册
  @Post('/login')
  async login(
    @Body() login: LoginDto,
    @Res() res: Response,
    @Req() req: any,
    @Query() query: any
  ) {
    login.name = login.name.trim()

    if (!login.name) {
      req.flash('error', '用户名不能为空')
      return res.redirect('back')
    }
    let user = await this.userService.getUser({ name: login.name })

    // 用户名不存在则注册
    if (!user) {
      user = await this.userService.addUser({
        name: login.name,
        password: sha1(login.password),
        ip: req.ip
      })

      req.flash('success', '注册成功')
    } else {
      if (user['password'] === sha1(login.password)) {
        req.flash('success', '登录成功')
      } else {
        req.flash('error', '用户名被占用或密码错误')
        return res.redirect('/posts')
      }
    }
    req.session.user = user.toObject()
    if (query.next) {
      return res.redirect(query.next)
    } else {
      return res.redirect('/posts')
    }
  }
}
