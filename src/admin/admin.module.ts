import { AdminGuard } from 'src/common/guard/admin.guard';
import { Module } from "@nestjs/common";
import { PostAdminController } from "src/admin/controller/post.controller";
import { APP_GUARD } from "@nestjs/core";

@Module({
  controllers: [PostAdminController]
})
export class AdminModule { }
