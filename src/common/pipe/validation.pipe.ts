import { PipeTransform, BadRequestException, ArgumentMetadata, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    // 没有指定 metatype 或者 metatype为内置类型
    // toValidate 排除原生 JavaScript 类型。
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    // 如果不是原生类型才验证
    return !types.find((type) => metatype === type);
  }
}

// export interface ArgumentMetadata {
//   type: 'body' | 'query' | 'param' | 'custom';
    // 属性的元类型，例如 String。
//   metatype?: new (...args) => any;
    // 传递给装饰器的字符串，例如 @Body('string')。
//   data?: string;
// }
