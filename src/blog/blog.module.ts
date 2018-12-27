import { Module } from "@nestjs/common";
import { PostController } from "src/blog/cotroller/post.cotroller";
import { UserController } from "src/blog/cotroller/user.controller";
import { CommentController } from "src/blog/cotroller/comment.controller";

@Module({
  controllers: [PostController, UserController, CommentController]
})
export class BlogModule { }
