import { ForbiddenException } from '@nestjs/common';
// 守卫有一个单独的责任。它们确定请求是否应该由路由处理程序处理。
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  // 如果返回 false 则忽略当前请求
  // ExecutionContext 继承自 ArgumentsHost
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.session.user
    if (!user || user.role !== 1) {
      throw new ForbiddenException('Forbidden')
    }
    return true
  }
}
