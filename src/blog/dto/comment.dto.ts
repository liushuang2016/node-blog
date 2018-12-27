import { IsString, Length } from "class-validator";

export class CommentDto {
  @IsString()
  @Length(1, 150, {
    message: '评论字数请限制在150字以内'
  })
  content: string
}
