import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class NotLoginGuard implements CanActivate {
  // 如果返回 false 则返回 403 http 异常
  // ExecutionContext 继承自 ArgumentsHost
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.session.user

    if (user) {
      throw new ForbiddenException('已经是登录状态')
    }
    return true
  }
}
