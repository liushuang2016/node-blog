import { Module } from "@nestjs/common";
import { PostAdminController } from "src/admin/controller/post.controller";
import { UserAdminController } from "src/admin/controller/user.controller";

@Module({
  controllers: [PostAdminController, UserAdminController]
})
export class AdminModule { }
