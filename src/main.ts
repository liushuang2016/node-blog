import { ValidationPipe } from 'src/common/pipe/validation.pipe';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AnyExceptionFilter } from 'src/common/filter/any-exception.filter';
import { MyLogger } from 'src/common/logger/myLogger';
import * as morgan from "morgan";
import { logger } from 'src/common/logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new MyLogger()
  })
  // 异常过滤
  app.useGlobalFilters(new AnyExceptionFilter())
  // 使用管道实现全局参数验证
  app.useGlobalPipes(new ValidationPipe)
  // logger 打印
  app.use(morgan('dev'))
  await app.listen(3000)
}
bootstrap()
