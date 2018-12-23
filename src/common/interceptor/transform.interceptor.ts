import { Injectable, NestInterceptor, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    call$: Observable<T>,
  ): Observable<Response<T>> {
    return call$.pipe(map(data => ({ data })));
  }
}

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    return call$.pipe(map(value => value === null ? '' : value));
  }
}

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    return call$.pipe(
      // 利用 catchError() 操作符来覆盖抛出的异常
      catchError(err =>
        of(new HttpException('Message', HttpStatus.BAD_GATEWAY)),
      ),
    );
  }
}

// 缓存拦截器, 它将缓存的响应存储在一些 TTL 中。
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    const isCached = true;
    if (isCached) {
      // call$ 中会有路由函数返回的数据，如果提前返回数据，则不会调用路由处理函数
      return of([]);
    }
    return call$;
  }
}

// 如果路由函数指定时间没有返回，则会作为超时处理
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    return call$.pipe(timeout(5000))
  }
}
