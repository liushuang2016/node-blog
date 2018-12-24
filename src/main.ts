import { ValidationPipe } from 'src/common/pipe/validation.pipe';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AnyExceptionFilter } from 'src/common/filter/any-exception.filter';
import { MyLogger } from 'src/common/logger/myLogger';
import * as morgan from "morgan";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new MyLogger()
  })
  // logger 打印
  app.use(morgan('dev'))
  // 设置模板引擎为 ejs
  app.useStaticAssets(__dirname + '/public')
  app.setBaseViewsDir(__dirname + '/views')
  app.setViewEngine('ejs')

  // 添加模板变量
  app.use(function (req, res, next) {
    res.locals.title = 'LiuShuang\'sBlog'
    res.locals.user = req.session.user
    res.locals.success = req.flash('success').toString()
    res.locals.error = req.flash('error').toString()
    next()
  })
  // 异常过滤
  app.useGlobalFilters(new AnyExceptionFilter())
  // 使用管道实现全局参数验证
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(3000)
}
bootstrap()
