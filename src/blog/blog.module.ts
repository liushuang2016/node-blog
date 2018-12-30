import { Module } from "@nestjs/common";
import { PostController } from "./cotroller/post.cotroller";
import { UserController } from "./cotroller/user.controller";
import { CommentController } from "./cotroller/comment.controller";
import { TagsController } from "./cotroller/tag.controller";

@Module({
  controllers: [PostController, UserController, CommentController, TagsController]
})
export class BlogModule { }
