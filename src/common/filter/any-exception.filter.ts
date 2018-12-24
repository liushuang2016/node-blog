import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { logger } from 'src/common/logger/logger';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    logger.error(exception)
    request.flash(exception.message)
    response.redirect('/posts')
  }
}
