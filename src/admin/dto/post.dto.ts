import { IsString, Length } from "class-validator";

export class PostDto {
  @IsString()
  @Length(3, 40, {
    message: '文章标题请限制在3-40位'
  })
  title: string;

  @IsString()
  @Length(1, 50, {
    message: '请输入至少一个tag'
  })
  tags: string;

  @IsString()
  @Length(3, 50000, {
    message: '请输入文章内容'
  })
  content: string;
}
