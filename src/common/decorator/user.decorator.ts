import { createRouteParamDecorator } from '@nestjs/common';

// data 是装饰器调用时的传参
export const User = createRouteParamDecorator((data, req) => {
  return req.user;
});
