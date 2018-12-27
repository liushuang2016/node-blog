
import { Controller, Get, Render, UseGuards, Req, Res, Body, Post, Query } from "@nestjs/common";
import { NotLoginGuard } from "src/common/guard/checkNotLogin.guard";
import { Request, Response } from "express";
import { LoginDto } from "src/blog/dto/login.dto";
import { User } from "src/model/User";
import * as sha1 from "sha1";

@Controller()
export class UserController {
  @Get('/login')
  @Render('login')
  @UseGuards(NotLoginGuard)
  loginPage() {
    return {}
  }

  @Get('/logout')
  logout(@Req() req: any, @Res() res: Response) {
    if (req.session.user) {
      req.session.user = null
      req.flash('success', '登出成功')
    }
    return res.redirect('/posts')
  }

  @Post('/login')
  async login(
    @Body() login: LoginDto,
    @Res() res: Response,
    @Req() req: any,
    @Query() query: any
  ) {
    login.name = login.name.trim()
    login.password = login.password.trim()
    let user = await User.findOne({ name: login.name })
    // 用户名不存在则注册
    if (!user) {
      user = new User({
        name: login.name,
        password: sha1(login.password),
        ip: req.ip
      })
      user = await user.save()
      req.flash('success', '注册成功')
    } else {
      if (user['password'] === sha1(login.password)) {
        req.flash('success', '登录成功')
      } else {
        req.flash('error', '用户名被占用或密码错误')
        return res.redirect('back')
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
