import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  // 当用户尝试调用没有足够权限的 端点时，Nest 会自动返回 403 json 响应
  // 返回 false 的守护器强制 Nest 抛出一个 HttpException 异常。如果您想要向最终用户返回不同的错误响应，则应该引发异常.这个异常可以被异常过滤器捕获。
  canActivate(context: ExecutionContext): boolean {
    // getHandler 表示路由处理程序
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // some：有一个值为true 则为true
    // hasRole 为 function
    const hasRole = () => user.roles.some((role) => roles.findIndex(role) > -1);
    return user && user.roles && hasRole();
  }
}
