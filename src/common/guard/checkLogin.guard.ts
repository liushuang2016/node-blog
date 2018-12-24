import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  // 如果返回 false 则忽略当前请求
  // ExecutionContext 继承自 ArgumentsHost
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.session.user
    if (!user) {
      throw new ForbiddenException('请先登录')
    }
    return true
  }
}
