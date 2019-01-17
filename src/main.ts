import { AnyExceptionFilter } from './common/filter/any-exception.filter';
import { ValidationPipe } from './common/pipe/validation.pipe';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLogger } from './common/logger/myLogger';
import * as morgan from "morgan";
import * as flash from "connect-flash";
import * as session from "express-session";
import * as config from "config";
import * as MongoStore from "connect-mongo";
import { limiter } from './common/middleware/limit.middleware';

async function bootstrap() {
  let app = await NestFactory.create(AppModule, {
    logger: new MyLogger(),
    cors: true
  })
  app.enable("trust proxy");
  // 频率限制
  app.use(limiter)
  // logger 打印
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
  }
  // 设置模板引擎为 ejs
  app.useStaticAssets('public')
  app.setBaseViewsDir('views')
  app.setViewEngine('ejs')

  app.use(flash())
  // session 中间件
  const mongoStore = MongoStore(session)
  app.use(session({
    name: config.get('session.key'), // 设置 cookie 中保存 session id 的字段名称
    secret: config.get('session.secret'), // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true, // 强制更新 session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
      maxAge: config.get('session.maxAge') // 过期时间
    },
    store: new mongoStore({// 将 session 存储到 mongodb
      url: config.get('mongodb') // mongodb 地址
    })
  }))
  // 添加模板变量
  app.use(function (req, res, next) {
    res.locals.title = 'LiuShuang\'s Blog'
    res.locals.user = req.session.user
    res.locals.next = ''
    res.locals.description = ''
    res.locals.keywords = ''
    res.locals.cdnUrl = 'https://blog-1253581643.file.myqcloud.com'
    res.locals.pv = 0
    res.locals.success = req.flash('success').toString()
    res.locals.error = req.flash('error').toString()
    next()
  })
  // 使用管道实现全局参数验证
  app.useGlobalPipes(new ValidationPipe())
  // 全局异常过滤
  app.useGlobalFilters(new AnyExceptionFilter())

  await app.listen(3000)
}
bootstrap()
