import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AnyExceptionFilter } from 'src/common/filter/any-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // 异常过滤
  app.useGlobalFilters(new AnyExceptionFilter())
  await app.listen(3000)
}
bootstrap()
