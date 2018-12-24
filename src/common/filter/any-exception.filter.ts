import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { logger } from 'src/common/logger/logger';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const arr = [403, 404]

    if (arr.indexOf(exception.status) < 0) {
      logger.error(exception)
      console.log(exception)
    }

    if (exception.status === 404) {
      response.render('404')
    } else if (exception.status === 444) {
      request.flash('error', exception.message.message)
      response.redirect('back')
    } else {
      request.flash('error', exception.message.message)
      response.redirect('/posts')
    }

  }
}
