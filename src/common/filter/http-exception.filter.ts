import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

// 要过滤的类型
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // ArgumentsHost 是传递给原始处理程序的参数的一个包装 ，它根据应用程序的类型在底层包含不同的参数数组。
  // 当过滤器在 HTTP 应用程序上下文中使用时， ArgumentsHost 将包含 [request, response] 数组。
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    response
      .status(status)
      .json({
        statusCode: exception.getStatus(),
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
