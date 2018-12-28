import { Module } from "@nestjs/common";
import { PostController } from "src/blog/cotroller/post.cotroller";
import { UserController } from "src/blog/cotroller/user.controller";
import { CommentController } from "src/blog/cotroller/comment.controller";
import { TagsController } from "src/blog/cotroller/tag.controller";

@Module({
  controllers: [PostController, UserController, CommentController, TagsController]
})
export class BlogModule { }
