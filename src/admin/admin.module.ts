import { Module } from "@nestjs/common";
import { PostAdminController } from "src/admin/controller/post.controller";
import { UserAdminController } from "src/admin/controller/user.controller";
import { CommentAdminController } from "src/admin/controller/comment.controller";

@Module({
  controllers: [PostAdminController, UserAdminController, CommentAdminController]
})
export class AdminModule { }
