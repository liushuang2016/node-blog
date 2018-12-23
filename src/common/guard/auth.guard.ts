// 守卫有一个单独的责任。它们确定请求是否应该由路由处理程序处理。
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  // 如果返回 false 则忽略当前请求
  // ExecutionContext 继承自 ArgumentsHost
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(res: any) {
    return true
  }
}

// getHandler() 返回一个参考当前处理的处理程序，而 getClass() 返回此 Controller 特定处理程序属于的类别。
// export interface ExecutionContext extends ArgumentsHost {
//   getClass<T = any>(): Type<T>;
//   getHandler(): Function;
// }
