import { ResJson } from './../dto/res.dto';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { httpErrorLogger } from '../../common/logger/logger';

@Catch()
export class AdminExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    // 不计入日志的错误码
    const arr = [403, 404, 444, 400, 401]

    if (arr.indexOf(exception.status) === -1) {
      httpErrorLogger(request, response, exception)
    }

    let message = ''
    if (exception.message) {
      message = typeof exception.message === 'string'
        ? exception.message
        : exception.message.message
    } else {
      message = exception.ValidationError
    }

    response
      .json(new ResJson({
        code: exception.status,
        msg: message,
      }))
  }
}
