import { Module } from "@nestjs/common";
import { PostAdminController } from "./controller/post.controller";
import { UserAdminController } from "./controller/user.controller";
import { CommentAdminController } from "./controller/comment.controller";

@Module({
  controllers: [PostAdminController, UserAdminController, CommentAdminController]
})
export class AdminModule { }
