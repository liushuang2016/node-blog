import { IsString, Length } from "class-validator";

export class LoginDto {
  @IsString()
  @Length(2, 8, {
    message: '用户名请限制在2-8位'
  })
  name: string;

  @IsString()
  @Length(3, 12, {
    message: '密码请限制在3-12位'
  })
  password: string;
}
